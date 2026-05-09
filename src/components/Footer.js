import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16">
      <div style={{ background: "#1D9E75" }} className="px-6 md:px-8 pt-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10">
            {/* Brand */}
            <div>
              <div className="mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/merbabu.png"
                  alt="Distro Merbabu"
                  className="h-12 w-auto"
                />
              </div>
              <p
                style={{ color: "#9FE1CB" }}
                className="text-sm leading-relaxed mb-4"
              >
                Toko pakaian distro berkualitas tinggi dengan desain stylish
                untuk aktivitas outdoor dan sehari-hari.
              </p>
              <div className="flex gap-2">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  style={{ background: "rgba(255,255,255,0.15)" }}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs hover:opacity-80"
                >
                  ig
                </a>
                <a
                  href="https://wa.me/08123456789"
                  target="_blank"
                  style={{ background: "rgba(255,255,255,0.15)" }}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs hover:opacity-80"
                >
                  wa
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  style={{ background: "rgba(255,255,255,0.15)" }}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs hover:opacity-80"
                >
                  tt
                </a>
              </div>
            </div>

            {/* Navigasi */}
            <div>
              <p
                style={{ color: "#5DCAA5" }}
                className="text-xs font-medium uppercase tracking-widest mb-4"
              >
                Navigasi
              </p>
              <div className="flex flex-col gap-2.5">
                <Link
                  href="/"
                  style={{ color: "#E1F5EE" }}
                  className="text-sm hover:text-white"
                >
                  Beranda
                </Link>
                <Link
                  href="/produk"
                  style={{ color: "#E1F5EE" }}
                  className="text-sm hover:text-white"
                >
                  Semua Produk
                </Link>
                <Link
                  href="/keranjang"
                  style={{ color: "#E1F5EE" }}
                  className="text-sm hover:text-white"
                >
                  Keranjang
                </Link>
                <Link
                  href="/tentang"
                  style={{ color: "#E1F5EE" }}
                  className="text-sm hover:text-white"
                >
                  Tentang Kami
                </Link>
              </div>
            </div>

            {/* Kontak */}
            <div>
              <p
                style={{ color: "#5DCAA5" }}
                className="text-xs font-medium uppercase tracking-widest mb-4"
              >
                Kontak
              </p>
              <div className="flex flex-col gap-2.5">
                <span style={{ color: "#E1F5EE" }} className="text-sm">
                  📍 Tangerang, Banten
                </span>
                <span style={{ color: "#E1F5EE" }} className="text-sm">
                  📱 08123456789
                </span>
                <span style={{ color: "#E1F5EE" }} className="text-sm">
                  ✉️ distromerbabu@gmail.com
                </span>
                <span style={{ color: "#E1F5EE" }} className="text-sm">
                  🕐 Senin - Sabtu, 09.00 - 21.00
                </span>
              </div>
            </div>
          </div>
        </div>

        <svg
          viewBox="0 0 1440 60"
          xmlns="http://www.w3.org/2000/svg"
          className="block w-full -mb-px"
        >
          <path
            d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z"
            fill="white"
          />
        </svg>
      </div>

      <div className="bg-white px-6 md:px-8 py-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Distro Merbabu. All rights reserved.
          </p>
          <div className="flex gap-1.5">
            <span
              style={{ background: "#E1F5EE", color: "#0F6E56" }}
              className="text-xs px-3 py-1 rounded-full"
            >
              Next.js
            </span>
            <span
              style={{ background: "#E1F5EE", color: "#0F6E56" }}
              className="text-xs px-3 py-1 rounded-full"
            >
              Tailwind
            </span>
            <span
              style={{ background: "#E1F5EE", color: "#0F6E56" }}
              className="text-xs px-3 py-1 rounded-full"
            >
              Supabase
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
