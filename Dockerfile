# ==========================================
# 1. Builder Stage
# ==========================================
FROM node:20 AS builder
WORKDIR /app

# Salin package.json terlebih dahulu
COPY package.json package-lock.json ./
COPY prisma ./prisma/

# Install semua dependensi (wajib sertakan devDependencies)
RUN npm ci --include=dev

# MANTRA RAHASIA: Install Prisma CLI secara global untuk menghindari bug npx di Docker
RUN npm install -g prisma

# Salin sisa kode aplikasi
COPY . .

# Variabel dummy wajib
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:6543/dummy_db"
ENV DIRECT_URL="postgresql://dummy:dummy@localhost:5432/dummy_db"
ENV NEXT_TELEMETRY_DISABLED=1

# JALANKAN PRISMA DENGAN MODE DEBUG
# Jika gagal, ia akan mencetak ribuan baris log merah agar kita tahu pasti apa penyakitnya
RUN DEBUG="prisma:*" prisma generate

# Build aplikasi Next.js
RUN npm run build

# ==========================================
# 2. Production Stage (Runner)
# ==========================================
FROM node:20-slim AS runner
WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV="production"
ENV PORT="3000"
ENV HOSTNAME="0.0.0.0"

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