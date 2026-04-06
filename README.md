# 🏔️ Distro Merbabu — Website Marketplace

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-22-339933?style=for-the-badge&logo=node.js&logoColor=white)

<br/>

**Website marketplace modern untuk toko pakaian Distro Merbabu.**
Dibuat sebagai project skripsi dengan teknologi web terkini.

[Demo](#) · [Laporan Bug](#) · [Minta Fitur](#)

</div>

---

## 📋 Daftar Isi

- [Tentang Project](#-tentang-project)
- [Fitur](#-fitur)
- [Tech Stack](#-tech-stack)
- [Cara Install](#-cara-install)
- [Struktur Folder](#-struktur-folder)
- [Screenshot](#-screenshot)
- [Kontribusi](#-kontribusi)
- [Lisensi](#-lisensi)

---

## 🏔️ Tentang Project

**Distro Merbabu** adalah website marketplace yang dirancang untuk memudahkan proses jual beli pakaian distro secara online. Project ini dibuat sebagai tugas akhir (skripsi) dengan menggunakan teknologi web modern berbasis Next.js.

Website ini memungkinkan pelanggan untuk melihat katalog produk, melihat detail produk, dan melakukan pembelian secara online. Sementara admin dapat mengelola produk, pesanan, dan data pelanggan melalui dashboard khusus.

---

## ✨ Fitur

### 🟢 Sudah Tersedia
- 🏠 **Halaman Beranda** — Menampilkan daftar produk terbaru
- 🛍️ **Halaman Semua Produk** — Katalog lengkap semua produk
- 📄 **Halaman Detail Produk** — Informasi lengkap tiap produk
- 🧭 **Navbar Navigasi** — Navigasi antar halaman yang responsif
- 🃏 **Komponen KartuProduk** — Komponen reusable untuk tampilan produk
- 🗄️ **Database Produk** — Data produk tersimpan di Supabase PostgreSQL
- 🔗 **Dynamic Routing** — URL unik untuk setiap produk

### 🔜 Akan Datang
- 🔐 **Autentikasi User** — Sistem login & register
- 🛒 **Keranjang Belanja** — Tambah & kelola produk di keranjang
- 📦 **Sistem Pesanan** — Proses checkout dan pelacakan pesanan
- 👨‍💼 **Dashboard Admin** — Kelola produk, pesanan, dan pengguna
- 📸 **Upload Foto Produk** — Upload dan manajemen gambar produk
- 🔍 **Filter & Pencarian** — Cari produk berdasarkan nama atau kategori

---

## 🛠️ Tech Stack

| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| [Next.js](https://nextjs.org/) | 15 | Framework utama (App Router) |
| [Tailwind CSS](https://tailwindcss.com/) | 3 | Styling & UI |
| [Prisma ORM](https://www.prisma.io/) | 7 | Manajemen database |
| [PostgreSQL](https://www.postgresql.org/) | - | Database relasional |
| [Supabase](https://supabase.com/) | - | Hosting database cloud |
| [Node.js](https://nodejs.org/) | 22 | Runtime JavaScript |

---

## 🚀 Cara Install

### Prasyarat

Pastikan kamu sudah menginstall:
- [Node.js](https://nodejs.org/) versi 18 ke atas
- [Git](https://git-scm.com/)
- Akun [Supabase](https://supabase.com/) (gratis)

### Langkah Instalasi

**1. Clone repository**
```bash
git clone https://github.com/username/distro-merbabu.git
cd distro-merbabu
```

**2. Install dependencies**
```bash
npm install
```

**3. Setup environment variable**

Buat file `.env` di root folder:
```env
DATABASE_URL="postgresql://postgres:PASSWORD@db.xxxxx.supabase.co:5432/postgres"
```

Ganti `PASSWORD` dan `xxxxx` dengan kredensial Supabase kamu.

**4. Generate Prisma Client**
```bash
npx prisma generate
```

**5. Jalankan migrasi database**
```bash
npx prisma migrate dev --name init
```

**6. Isi data awal (seed)**
```bash
node prisma/seed.js
```

**7. Jalankan project**
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser kamu. 🎉

---

## 📁 Struktur Folder

```
distro-merbabu/
├── prisma/
│   ├── schema.prisma       # Skema database
│   └── seed.js             # Data awal database
├── src/
│   ├── app/
│   │   ├── page.js         # Halaman beranda
│   │   ├── layout.js       # Layout utama
│   │   ├── produk/
│   │   │   ├── page.js     # Halaman semua produk
│   │   │   └── [id]/
│   │   │       └── page.js # Halaman detail produk
│   │   └── tentang/
│   │       └── page.js     # Halaman tentang
│   ├── components/
│   │   ├── Navbar.js       # Komponen navigasi
│   │   └── KartuProduk.js  # Komponen kartu produk
│   └── lib/
│       └── prisma.js       # Konfigurasi Prisma Client
├── prisma.config.ts        # Konfigurasi Prisma ORM
├── next.config.js          # Konfigurasi Next.js
├── tailwind.config.js      # Konfigurasi Tailwind CSS
├── .env                    # Environment variables (jangan di-commit!)
└── package.json            # Dependencies project
```

---

## 📸 Screenshot

<div align="center">

### Halaman Beranda
![Halaman Beranda](./public/screenshots/beranda.png)

### Halaman Detail Produk
![Detail Produk](./public/screenshots/detail.png)

</div>

> 📝 *Screenshot akan diperbarui seiring perkembangan project*

---

## 🗄️ Skema Database

```
Produk          User            Pesanan         PesananItem
──────────      ──────────      ──────────      ──────────
id              id              id              id
nama            nama            userId ──┐      pesananId ──┐
harga           email           total    │      produkId    │
kategori        password        status   │      jumlah      │
deskripsi       createdAt       createdAt│      harga       │
gambar                          └────────┘      └───────────┘
createdAt
```

---

## 🤝 Kontribusi

Kontribusi sangat diterima! Berikut langkah-langkahnya:

1. Fork repository ini
2. Buat branch fitur baru (`git checkout -b fitur/NamaFitur`)
3. Commit perubahan kamu (`git commit -m 'Menambahkan fitur NamaFitur'`)
4. Push ke branch (`git push origin fitur/NamaFitur`)
5. Buat Pull Request

---

## 📝 Lisensi

Didistribusikan di bawah Lisensi MIT. Lihat `LICENSE` untuk informasi lebih lanjut.

---

<div align="center">

Dibuat dengan ❤️ sebagai project skripsi

⭐ Jangan lupa beri bintang kalau project ini membantu!

</div>
