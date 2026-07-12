# 🚀 Deployment Guide — Dokploy + Supabase

Panduan lengkap deploy **Distro Merbabu** ke VPS pakai [Dokploy](https://dokploy.com) dengan database di **Supabase**.

---

## 📋 Prasyarat

- VPS sudah ter-install Dokploy dan bisa diakses di `https://<vps-ip>:3000`
- Domain sudah pointing ke IP VPS (A record) — misal `distro.example.com`
- Supabase project sudah dibuat, database sudah di-migrate secara lokal
- Repo project sudah ada di GitHub / GitLab / Gitea (Dokploy akan pull dari sana)
- Credentials Pakasir & Gmail App Password sudah siap

---

## 1️⃣ Ambil Connection String dari Supabase

Buka [Supabase Dashboard](https://supabase.com/dashboard) → pilih project → **Project Settings** → **Database** → **Connection string**.

Ambil **dua** URL berikut:

| Env | Mode | Port | Catatan |
|---|---|---|---|
| `DATABASE_URL` | **Transaction pooler** (pgbouncer) | **6543** | Untuk query normal Prisma. **Tambahkan** `?pgbouncer=true&connection_limit=1` di akhir |
| `DIRECT_URL` | **Direct connection** | **5432** | Untuk `prisma migrate deploy`. **JANGAN** pooler |

Contoh format (nilai persisnya sesuai dashboard):
```
DATABASE_URL="postgresql://postgres.abcd1234:PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres.abcd1234:PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
```

> ⚠️ Ganti `PASSWORD` dengan password database (bukan password akun Supabase).

---

## 2️⃣ Ambil Supabase URL & Anon Key (untuk Storage)

**Project Settings** → **API**:

- `NEXT_PUBLIC_SUPABASE_URL` → **Project URL**
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` → **anon public** (bagian **Project API Keys**)

Storage bucket yang dipakai project (cek di dashboard Storage) harus **public** atau minimal ada RLS policy yang mengizinkan `anon` upload dan `public` read.

---

## 3️⃣ Siapkan Gmail App Password (untuk reset password)

1. Login ke akun Gmail yang mau dipakai
2. Buka [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords) (butuh 2FA aktif)
3. Buat app password baru — copy hasil 16 karakter → itu nilai `EMAIL_PASS`
4. `EMAIL_USER` = alamat Gmail lengkap (misal `noreply@gmail.com`)

---

## 4️⃣ Generate NextAuth Secret

Di terminal (lokal), jalankan:
```bash
openssl rand -base64 32
```
Copy outputnya → itu nilai `NEXTAUTH_SECRET`.

---

## 5️⃣ Buat Aplikasi Baru di Dokploy

1. Login ke Dokploy
2. **Projects** → pilih project (atau buat baru) → **Create Service** → **Application**
3. Isi:
   - **Name**: `distro-merbabu`
   - **App Name / Path**: bebas (misal `distro-merbabu`)
4. Tab **Provider** → pilih sumber (GitHub / GitLab / Manual / Docker):
   - Kalau **GitHub**: hubungkan akun, pilih repo `distro-merbabu`, pilih branch `main`
5. Tab **Build**:
   - **Build Type**: `Dockerfile`
   - **Dockerfile Path**: `Dockerfile` (default, tidak perlu diubah)
   - **Docker Context Path**: `.` (root)

---

## 6️⃣ Isi Environment Variables di Dokploy

### 6a. Runtime Environment (tab **Environment**)

Buka tab **Environment** aplikasi, tambahkan **semua** variabel berikut:

```env
DATABASE_URL=postgresql://postgres.xxxx:PASSWORD@aws-0-...pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
DIRECT_URL=postgresql://postgres.xxxx:PASSWORD@aws-0-...pooler.supabase.com:5432/postgres

NEXTAUTH_SECRET=<hasil-openssl-rand>
NEXTAUTH_URL=https://distro.example.com

NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>

PAKASIR_SLUG=<slug-pakasir>
PAKASIR_API_KEY=<api-key-pakasir>

EMAIL_USER=you@gmail.com
EMAIL_PASS=<gmail-app-password>
```

> 💡 Semua nilai **tidak boleh** dalam tanda kutip di panel Dokploy.

### 6b. Build-time Variables (WAJIB) — tab **Environment** → **Build-time**

⚠️ **PENTING:** `NEXT_PUBLIC_*` di-**inline** ke dalam bundle JavaScript saat `next build`
(bukan dibaca saat runtime). Jadi keduanya **HARUS** juga di-set sebagai **build-time
variable** di Dokploy, kalau tidak fitur upload foto/bukti (Supabase Storage) akan rusak
karena nilainya ter-bake `undefined`.

Tambahkan sebagai **Build Args** (di Dokploy: tab **Environment**, aktifkan opsi
"Add to build" / atau bagian **Build-time Variables**):

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

Dockerfile sudah menyiapkan `ARG NEXT_PUBLIC_SUPABASE_URL` dan
`ARG NEXT_PUBLIC_SUPABASE_ANON_KEY` untuk menerima nilai ini saat build.
(Aman di-expose — anon key & URL memang bersifat publik.)

---

## 7️⃣ Konfigurasi Domain & SSL

Tab **Domains** di aplikasi Dokploy → **Add Domain**:

- **Host**: `distro.example.com`
- **Path**: `/`
- **Container Port**: `3000`
- **HTTPS**: aktifkan → pilih **Let's Encrypt** (auto SSL via Traefik)

Klik **Save**. Traefik akan auto-generate cert dalam beberapa detik.

> ⚠️ Pastikan A record domain sudah pointing ke IP VPS **sebelum** enable Let's Encrypt (kalau tidak, akan gagal issue cert).

---

## 8️⃣ Deploy Pertama Kali

Tab **General** → klik **Deploy**.

Dokploy akan:
1. Pull kode dari Git
2. Build image dari `Dockerfile` (multi-stage, output standalone Next.js)
3. Server Next.js start di port 3000 (`node server.js`)
4. Traefik route domain → container

> ℹ️ Migrasi database **tidak** dijalankan otomatis saat start (runner sengaja dibuat
> ramping). Lihat [§ Migrasi Database](#-migrasi-database). Untuk deploy pertama ini
> database kamu sudah ter-migrate di Supabase, jadi aman langsung jalan.

**Cek logs** di tab **Deployments** untuk memantau. Yang perlu muncul:
```
▲ Next.js 16.2.2
- Ready in Xs
```

---

## 9️⃣ Konfigurasi Webhook Pakasir

> ⚠️ **Wajib diisi.** Kalau Webhook URL kosong, Pakasir **tidak pernah** memberi tahu
> aplikasi saat pembayaran berhasil, sehingga status pesanan tidak berpindah otomatis
> ke `diproses` dan admin terpaksa konfirmasi manual.

Setelah aplikasi live, buka dashboard [Pakasir](https://pakasir.com) → project →
**Edit Proyek** → isi **Webhook URL** dengan (samakan dengan `NEXTAUTH_URL`):

```
https://merbabuoutdoor.my.id/api/pakasir/webhook
```

Ini yang akan di-hit saat pembayaran berhasil untuk update status pesanan.

**Cara kerja & catatan penting:**

- Pakasir mengirim `POST` dengan body: `{ amount, order_id, project, status, payment_method, completed_at }`.
  Transaksi berhasil ditandai dengan **`status: "completed"`** (bukan `paid`/`success`).
- Handler `/api/pakasir/webhook` memverifikasi `amount` cocok dengan total pesanan lalu
  re-cek ke API `transactiondetail` sebelum menandai lunas (mencegah payload palsu).
- **Fallback**: halaman `/pesanan/[id]` juga auto-polling ke `/api/pakasir/status` tiap 5 detik
  selama QR tampil, jadi status tetap update otomatis walau webhook telat/belum aktif —
  selama tab pembayaran user masih terbuka.
- **Mode Sandbox vs Production**: di dashboard, `Mode` menentukan lingkungan transaksi.
  Untuk uji end-to-end tanpa bayar nyata, gunakan endpoint simulasi `/api/pakasir/simulasi`
  (memakai `simulationPayment` Pakasir) yang langsung menandai pesanan lunas.

---

## 🔄 Update / Redeploy

Setiap kali kamu push ke branch yang di-track:

- **Kalau enable auto-deploy** (via GitHub webhook di Dokploy): auto rebuild + redeploy
- **Kalau manual**: klik tombol **Deploy** ulang di Dokploy

> ⚠️ Redeploy **tidak** menjalankan migrasi otomatis. Kalau ada migrasi baru, jalankan
> migrasi dulu (lihat § Migrasi Database) **sebelum** deploy versi yang memakai skema baru.

---

## 🗃️ Migrasi Database

Runner sengaja dibuat ramping (Next.js standalone) dan **tidak** membawa CLI Prisma,
jadi migrasi dijalankan **terpisah** dari container aplikasi — ini lebih andal dan
memisahkan perubahan skema dari boot aplikasi.

**Prinsip:** jalankan `prisma migrate deploy` memakai **`DIRECT_URL`** (port 5432,
NON-pooler). Transaction pooler (6543/pgbouncer) tidak cocok untuk migrasi.

### Cara paling gampang — dari mesin lokal

Pastikan `.env` lokal berisi `DIRECT_URL` production (Supabase direct 5432), lalu:

```bash
# cek dulu status migrasi vs database production
npx prisma migrate status

# terapkan migrasi yang belum di-apply
npx prisma migrate deploy
```

Karena `prisma.config.ts` sudah memakai `env("DIRECT_URL")`, perintah di atas otomatis
konek ke koneksi direct. Jalankan **sebelum** men-deploy kode yang butuh skema baru.

### Alternatif — via Dokploy (one-off command / SSH)

Kalau mau dari server, jalankan sekali di environment yang punya Node + repo:
```bash
DIRECT_URL="postgresql://...:5432/postgres" npx prisma migrate deploy
```

> 💡 Untuk deploy pertama ini kamu **tidak perlu** melakukan apa-apa — database sudah
> ter-migrate di Supabase (`npx prisma migrate status` akan bilang "Database schema is up to date").

---

## 🩺 Troubleshooting

### ❌ Build gagal di step `npx prisma generate`
- Cek `prisma/schema.prisma` valid — di Prisma 7 blok `datasource` **tidak boleh** ada `url`/`directUrl` (dipindah ke `prisma.config.ts`)
- `DATABASE_URL`/`DIRECT_URL` di Dockerfile pakai dummy (build tidak perlu koneksi real)

### ❌ Build gagal: `supabaseUrl is required` / `Pakasir config is not valid!`
- Client dibuat lazy, harusnya tidak muncul lagi. Kalau muncul, cek ada modul lain yang membuat client eksternal saat import (pindahkan ke pola lazy)

### ❌ Upload foto jalan di lokal tapi gagal/`undefined` di production
- `NEXT_PUBLIC_SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_ANON_KEY` belum di-set sebagai **build-time variable** (lihat § 6b). Nilai NEXT_PUBLIC di-bake saat build — set runtime saja tidak cukup, harus rebuild dengan build args benar

### ❌ Container crash: `PrismaClientInitializationError` / `ECONNREFUSED`
- `DATABASE_URL` salah / password salah / IP VPS belum di-whitelist Supabase (cek **Network Restrictions** di Supabase)

### ❌ `prisma migrate deploy` gagal (saat migrasi manual)
- `DIRECT_URL` **wajib** port 5432 (bukan 6543)
- Jangan pakai `?pgbouncer=true` di `DIRECT_URL`
- Cek migrations tersinkron: `npx prisma migrate status` dulu

### ❌ Upload foto ke Supabase Storage gagal
- Bucket harus ada & RLS policy mengizinkan `anon` insert
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` benar (bukan service role key)

### ❌ Email reset password tidak terkirim
- `EMAIL_PASS` **harus** App Password Gmail, bukan password akun
- 2FA di akun Gmail wajib aktif untuk bisa generate App Password

### ❌ Login berhasil tapi session hilang / redirect loop
- `NEXTAUTH_URL` harus **persis** sama dengan domain publik (dengan `https://`, tanpa trailing `/`)
- `NEXTAUTH_SECRET` harus diisi

### ❌ Webhook Pakasir tidak update status pesanan
- Cek URL webhook di dashboard Pakasir: `https://distro.example.com/api/pakasir/webhook`
- Cek logs container saat pembayaran → cari `Pakasir webhook:` di stdout

---

## 📊 Optional: Health Check

Kalau mau tambah healthcheck di Dokploy (Docker healthcheck), edit **Advanced** → **Docker** → **Health Check**:

- **Test**: `curl -f http://localhost:3000 || exit 1`
- **Interval**: 30s
- **Timeout**: 5s
- **Retries**: 3

---

## 🔒 Catatan Security

- **Jangan** commit file `.env` ke repo — sudah di-`.gitignore`
- **Jangan** pakai Supabase `service_role` key di frontend — hanya `anon` key
- Rotate `NEXTAUTH_SECRET` & `EMAIL_PASS` secara berkala
- Aktifkan **RLS** di semua tabel Supabase yang di-akses via `anon` key
- Aktifkan **2FA** di dashboard Dokploy & Supabase

---

Selesai 🎉 — Aplikasi live di `https://distro.example.com`.
