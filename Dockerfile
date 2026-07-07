# ==========================================
# 1. Builder Stage (Menggunakan OS Node Lengkap)
# ==========================================
FROM node:20 AS builder
WORKDIR /app

# Salin definisi paket terlebih dahulu
COPY package.json package-lock.json ./

# Install dependensi (Full OS dijamin tidak akan kekurangan library C/C++)
RUN npm ci

# Salin sisa kode aplikasi Anda
COPY . .

# Dummy environment variables untuk mem-bypass validasi skema Prisma
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:6543/dummy_db"
ENV DIRECT_URL="postgresql://dummy:dummy@localhost:5432/dummy_db"
ENV NEXT_TELEMETRY_DISABLED=1

# Generate Prisma Client (Pasti berhasil karena berjalan di Full OS)
RUN npx prisma generate

# Build aplikasi Next.js
RUN npm run build

# ==========================================
# 2. Production Stage (Runner menggunakan versi Slim)
# ==========================================
FROM node:20-slim AS runner
WORKDIR /app

# Tambahkan openssl untuk runtime Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Konfigurasi Environment untuk Production
ENV NODE_ENV="production"
ENV PORT="3000"
ENV HOSTNAME="0.0.0.0"

# Pengaturan keamanan pengguna
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Pindahkan file hasil kompilasi dari stage builder yang berat, ke stage runner yang ringan
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# Jalankan sebagai pengguna non-root
USER nextjs

EXPOSE 3000

# Perintah mengeksekusi aplikasi
CMD ["npm", "start"]