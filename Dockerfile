# syntax=docker/dockerfile:1.7
# ==========================================
# 1. Builder Stage
# ==========================================
FROM node:22-slim AS builder
WORKDIR /app

RUN apt-get update -y \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Manifest + prisma schema dulu supaya layer cache maksimal
COPY package.json package-lock.json ./
COPY prisma ./prisma/

# Install semua deps (termasuk dev — dibutuhkan untuk build & prisma generate)
RUN npm ci --include=dev

# Salin sisa source
COPY . .

# Catatan: Supabase (upload foto) sekarang dipanggil dari sisi SERVER dan env-nya
# dibaca saat RUNTIME (lihat src/lib/supabase.js), jadi TIDAK perlu build-arg
# NEXT_PUBLIC_SUPABASE_*. Cukup set SUPABASE_URL / SUPABASE_ANON_KEY (atau var
# NEXT_PUBLIC_* lama) sebagai Environment runtime di Dokploy. Lihat DEPLOYMENT.md §6.

# URL dummy: prisma generate & next build tidak butuh koneksi DB nyata
# (query runtime lewat adapter; halaman DB-backed sudah force-dynamic).
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:6543/dummy_db"
ENV DIRECT_URL="postgresql://dummy:dummy@localhost:5432/dummy_db"
ENV NEXT_TELEMETRY_DISABLED=1

RUN npx prisma generate
RUN npm run build

# ==========================================
# 2. Runner Stage (slim, Next.js standalone)
# ==========================================
FROM node:22-slim AS runner
WORKDIR /app

RUN apt-get update -y \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV="production"
ENV PORT="3000"
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

RUN groupadd --system --gid 1001 nodejs \
  && useradd  --system --uid 1001 --gid nodejs nextjs

# Output standalone: server.js + node_modules minimum (deps lain sudah di-bundle
# ke server chunks). Runtime query DB lewat @prisma/client + adapter-pg.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000

# Migrasi TIDAK dijalankan di sini (lihat DEPLOYMENT.md § Migrasi).
CMD ["node", "server.js"]
