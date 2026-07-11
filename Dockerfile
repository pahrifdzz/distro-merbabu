# syntax=docker/dockerfile:1.7
# ==========================================
# 1. Deps & Builder Stage
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

# Dummy URLs supaya prisma generate tidak butuh koneksi DB saat build
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:6543/dummy_db"
ENV DIRECT_URL="postgresql://dummy:dummy@localhost:5432/dummy_db"
ENV NEXT_TELEMETRY_DISABLED=1

RUN npx prisma generate

# Salin sisa source & build
COPY . .
RUN npm run build

# ==========================================
# 2. Runner Stage
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

# Output standalone dari Next.js (server.js + node_modules minimum)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Prisma CLI + engines + schema/migrations untuk `migrate deploy` saat start
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma/engines ./node_modules/@prisma/engines

USER nextjs
EXPOSE 3000

# Jalankan migrasi dulu, baru start server. Kalau migrasi gagal, container exit non-zero.
CMD ["sh", "-c", "npx prisma migrate deploy --schema=./prisma/schema.prisma && node server.js"]
