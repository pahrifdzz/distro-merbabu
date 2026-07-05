FROM node:20-alpine AS base

# ==========================================
# 1. Install Dependencies
# ==========================================
FROM base AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma/

RUN npm ci

# ==========================================
# 2. Build Aplikasi
# ==========================================
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Tambahkan KEDUA dummy variabel agar Prisma bisa membaca skema tanpa error
# Nilai ini hanya untuk mem-bypass validasi saat build, bukan untuk produksi
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:6543/dummy_db"
ENV DIRECT_URL="postgresql://dummy:dummy@localhost:5432/dummy_db"

# Generate Prisma Client
RUN npx prisma generate --schema=./prisma/schema.prisma

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

RUN apk add --no-cache openssl

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