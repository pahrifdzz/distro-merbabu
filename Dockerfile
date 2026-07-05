FROM node:20-alpine AS base

# 1. Peringkat Pemasangan Dependencies (deps)
FROM base AS deps
# Tambahkan libc6-compat dan openssl (wajib untuk Prisma pada Alpine)
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Salin fail konfigurasi pakej
COPY package.json package-lock.json ./
# Salin skema Prisma
COPY prisma ./prisma/

# Pasang dependencies dengan clean install
RUN npm ci

# 2. Peringkat Pembinaan Aplikasi (builder)
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Jana Prisma Client
RUN npx prisma generate

# Bina aplikasi Next.js
RUN npm run build

# 3. Peringkat Pelaksanaan (runner) - Image akhir untuk Production
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Tambahkan openssl untuk Prisma semasa runtime
RUN apk add --no-cache openssl

# Tetapkan pengguna non-root demi keselamatan
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Salin fail-fail penting sahaja dari peringkat builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# Gunakan pengguna non-root yang telah dibuat
USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Jalankan aplikasi
CMD ["npm", "start"]