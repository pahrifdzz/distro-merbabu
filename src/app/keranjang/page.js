"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useKeranjang } from "@/context/KeranjangContext";

export default function KeranjangPage() {
  const { keranjang, hapusDariKeranjang, ubahJumlah, totalHarga } =
    useKeranjang();

  if (keranjang.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-20 text-center">
          <p className="text-4xl mb-4">🛒</p>
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Keranjang kamu kosong
          </h1>
          <p className="text-gray-600 text-sm mb-6">
            Yuk mulai belanja produk Distro Merbabu!
          </p>
          <Link
            href="/"
            className="bg-black text-white px-6 py-2.5 rounded-full text-sm hover:bg-gray-800"
          >
            Lihat Produk
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-10">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
          Keranjang Belanja
        </h1>

        {/* Column di mobile, row di desktop */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Daftar produk */}
          <div className="flex-1 flex flex-col gap-4">
            {keranjang.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-gray-200 p-4 flex gap-4 items-center"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                  {item.gambar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.gambar}
                      alt={item.nama}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-xs">Foto</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400 uppercase">
                    {item.kategori}
                  </p>
                  <p className="font-semibold text-gray-800 text-sm truncate">
                    {item.nama}
                  </p>
                  <p className="text-green-600 text-sm font-medium">
                    Rp {item.harga.toLocaleString("id-ID")}
                  </p>
                </div>
                <div className="flex items-center gap-1 md:gap-2">
                  <button
                    onClick={() => ubahJumlah(item.id, item.jumlah - 1)}
                    className="w-7 h-7 border border-gray-200 rounded-full text-sm hover:bg-gray-50"
                  >
                    −
                  </button>
                  <span className="text-sm w-5 text-center">{item.jumlah}</span>
                  <button
                    onClick={() => ubahJumlah(item.id, item.jumlah + 1)}
                    className="w-7 h-7 border border-gray-200 rounded-full text-sm hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-semibold text-sm">
                    Rp {(item.harga * item.jumlah).toLocaleString("id-ID")}
                  </p>
                  <button
                    onClick={() => hapusDariKeranjang(item.id)}
                    className="text-xs text-red-400 hover:text-red-600 mt-1"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Ringkasan belanja */}
          <div className="w-full lg:w-72 shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-bold text-gray-900 mb-4">
                Ringkasan Belanja
              </h2>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Subtotal</span>
                <span>Rp {totalHarga.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mb-4">
                <span>Ongkir</span>
                <span className="text-green-600">Gratis</span>
              </div>
              <div className="border-t border-gray-100 pt-4 flex justify-between font-bold text-gray-900 mb-6">
                <span>Total</span>
                <span>Rp {totalHarga.toLocaleString("id-ID")}</span>
              </div>
              <Link
                href="/checkout"
                className="w-full bg-black text-white py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition block text-center"
              >
                Lanjut ke Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
