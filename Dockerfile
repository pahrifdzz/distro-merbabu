FROM node:20-alpine AS base

# ==========================================
# 1. Install Dependencies
# ==========================================
FROM base AS deps
# Tambahkan libc6-compat dan openssl (dibutuhkan oleh Prisma Engine di Alpine)
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Salin file package dan schema Prisma
COPY package.json package-lock.json ./
COPY prisma ./prisma/

# Install dependencies secara clean
RUN npm ci

# ==========================================
# 2. Build Aplikasi
# ==========================================
FROM base AS builder
WORKDIR /app

# Salin node_modules dari tahap deps dan seluruh file proyek Anda
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Berikan dummy DATABASE_URL agar proses parsing schema.prisma tidak gagal
# Nilai ini HANYA digunakan saat proses build image dan tidak akan dipakai di tahap production
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy_db"

# Generate Prisma Client
RUN npx prisma generate

# Build aplikasi Next.js
RUN npm run build

# ==========================================
# 3. Production Image (Runner)
# ==========================================
FROM base AS runner
WORKDIR /app

# Perbaikan format ENV (mengatasi warning LegacyKeyValueFormat)
ENV NODE_ENV="production"
ENV PORT="3000"
ENV HOSTNAME="0.0.0.0"

# Tambahkan openssl untuk Prisma di runtime production
RUN apk add --no-cache openssl

# Set up user non-root untuk keamanan server
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Salin hasil build dan dependensi dari tahap builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# Pindah ke user non-root
USER nextjs

EXPOSE 3000

# Jalankan aplikasi Next.js
CMD ["npm", "start"]