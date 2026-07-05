FROM node:20-slim AS base

# ==========================================
# 1. Install Dependencies
# ==========================================
FROM base AS deps
# Install openssl menggunakan apt-get (wajib untuk Prisma di Debian/Ubuntu)
RUN apt-get update -y && apt-get install -y openssl
WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma/

# PAKSA install devDependencies (--include=dev) agar Prisma CLI PASTI terinstal
RUN npm ci --include=dev

# ==========================================
# 2. Build Aplikasi
# ==========================================
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Dummy environment variables agar Prisma bisa memvalidasi skema
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:6543/dummy_db"
ENV DIRECT_URL="postgresql://dummy:dummy@localhost:5432/dummy_db"

# Tambahkan --yes untuk mencegah prompt otomatis (yang bikin Docker crash)
RUN npx --yes prisma generate

# Build aplikasi Next.js
RUN npm run build

# ==========================================
# 3. Production Image (Runner)
# ==========================================
FROM base AS runner
WORKDIR /app

ENV NODE_ENV="production"
ENV PORT="3000"
ENV HOSTNAME="0.0.0.0"

# Install openssl untuk runtime production
RUN apt-get update -y && apt-get install -y openssl

# Set up user non-root untuk keamanan server
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

USER nextjs
EXPOSE 3000

CMD ["npm", "start"]