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
3. Saat container start, `prisma migrate deploy` jalan otomatis → sync skema DB
4. Server Next.js start di port 3000
5. Traefik route domain → container

**Cek logs** di tab **Deployments** untuk memantau. Yang perlu muncul:
```
✔ Applied migrations (atau "No pending migrations to apply")
▲ Next.js ... 
- Ready in Xs
```

---

## 9️⃣ Konfigurasi Webhook Pakasir

Setelah aplikasi live, buka dashboard [Pakasir](https://pakasir.com) → project → **Webhook URL**:

```
https://distro.example.com/api/pakasir/webhook
```

Ini yang akan di-hit saat pembayaran berhasil untuk update status pesanan.

---

## 🔄 Update / Redeploy

Setiap kali kamu push ke branch yang di-track:

- **Kalau enable auto-deploy** (via GitHub webhook di Dokploy): auto rebuild + redeploy
- **Kalau manual**: klik tombol **Deploy** ulang di Dokploy

Setiap redeploy otomatis jalankan `prisma migrate deploy` — kalau ada migrasi baru, akan di-apply.

---

## 🩺 Troubleshooting

### ❌ Build gagal di step `npx prisma generate`
- Cek `prisma/schema.prisma` valid
- Pastikan `DATABASE_URL` di Dockerfile pakai dummy (build tidak perlu koneksi real)

### ❌ Container crash: `PrismaClientInitializationError`
- `DATABASE_URL` salah / password salah / IP VPS belum di-whitelist Supabase (Supabase default terbuka, tapi cek Network Restrictions)

### ❌ Migration gagal saat start container
- `DIRECT_URL` **wajib** port 5432 (bukan 6543)
- Jangan pakai `?pgbouncer=true` di `DIRECT_URL`
- Cek migrations tersinkron antara lokal dan remote — jalankan `npx prisma migrate status` lokal dulu untuk verifikasi

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
