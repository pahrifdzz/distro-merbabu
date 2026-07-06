FROM node:20-slim AS base

# ==========================================
# 1. Builder Stage (Install & Build Disatukan)
# ==========================================
FROM base AS builder
# Install dependencies level OS untuk Prisma
RUN apt-get update -y && apt-get install -y openssl
WORKDIR /app

# Salin file definisi paket dan skema
COPY package.json package-lock.json ./
COPY prisma ./prisma/

# Install semua dependensi. 
# Dilakukan SEBELUM COPY . . untuk memanfaatkan cache Docker
RUN npm ci

# Salin seluruh kode (karena ada .dockerignore, node_modules lokal tidak akan ikut)
COPY . .

# Variabel dummy agar Prisma tidak mencari database asli saat proses build
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:6543/dummy_db"
ENV DIRECT_URL="postgresql://dummy:dummy@localhost:5432/dummy_db"
ENV NEXT_TELEMETRY_DISABLED=1

# Generate Prisma Client (Berada di stage yang sama dengan npm ci, dijamin aman)
RUN npx prisma generate

# Build Next.js
RUN npm run build

# ==========================================
# 2. Production Stage (Runner)
# ==========================================
FROM base AS runner
RUN apt-get update -y && apt-get install -y openssl
WORKDIR /app

ENV NODE_ENV="production"
ENV PORT="3000"
ENV HOSTNAME="0.0.0.0"

# Setup keamanan
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Hanya salin folder yang dibutuhkan untuk menjalankan aplikasi
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

USER nextjs
EXPOSE 3000

CMD ["npm", "start"]