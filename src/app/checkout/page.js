"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import { useKeranjang } from "@/context/KeranjangContext";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { keranjang, totalHarga, kosongkanKeranjang } = useKeranjang();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nama: "",
    alamat: "",
    kota: "",
    telepon: "",
  });

  if (keranjang.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-5xl mx-auto px-8 py-20 text-center">
          <p className="text-4xl mb-4">🛒</p>
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Keranjang kamu kosong
          </h1>
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

  if (!session) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-5xl mx-auto px-8 py-20 text-center">
          <p className="text-4xl mb-4">🔐</p>
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Kamu belum login
          </h1>
          <p className="text-gray-600 text-sm mb-6">
            Login dulu untuk melanjutkan checkout
          </p>
          <Link
            href="/login"
            className="bg-black text-white px-6 py-2.5 rounded-full text-sm hover:bg-gray-800"
          >
            Login Sekarang
          </Link>
        </div>
      </main>
    );
  }

  const handleCheckout = async () => {
    if (!form.nama || !form.alamat || !form.kota || !form.telepon) {
      alert("Semua field wajib diisi!");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/pesanan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: keranjang,
        total: totalHarga,
        alamat: `${form.alamat}, ${form.kota}`,
        telepon: form.telepon,
        nama: form.nama,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Terjadi kesalahan");
      setLoading(false);
      return;
    }

    kosongkanKeranjang();
    router.push(`/pesanan/${data.pesananId}`);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-8 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

        <div className="flex gap-8">
          {/* Form pengiriman */}
          <div className="flex-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
              <h2 className="font-bold text-gray-900 mb-4">
                Informasi Pengiriman
              </h2>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-800 block mb-1">
                    Nama Penerima
                  </label>
                  <input
                    type="text"
                    placeholder="Masukkan nama penerima"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-black"
                    value={form.nama}
                    onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-800 block mb-1">
                    Nomor Telepon
                  </label>
                  <input
                    type="text"
                    placeholder="Masukkan nomor telepon"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-black"
                    value={form.telepon}
                    onChange={(e) =>
                      setForm({ ...form, telepon: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-800 block mb-1">
                    Alamat Lengkap
                  </label>
                  <textarea
                    placeholder="Masukkan alamat lengkap"
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-black resize-none"
                    value={form.alamat}
                    onChange={(e) =>
                      setForm({ ...form, alamat: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-800 block mb-1">
                    Kota
                  </label>
                  <input
                    type="text"
                    placeholder="Masukkan kota"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-black"
                    value={form.kota}
                    onChange={(e) => setForm({ ...form, kota: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Metode pembayaran */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-bold text-gray-900 mb-4">
                Metode Pembayaran
              </h2>
              <div className="border border-black rounded-lg p-4 flex items-center gap-3">
                <div className="w-4 h-4 rounded-full border-2 border-black flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-black"></div>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  Transfer Bank (Manual)
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Setelah checkout, kamu akan mendapat instruksi pembayaran via
                transfer bank.
              </p>
            </div>
          </div>

          {/* Ringkasan pesanan */}
          <div className="w-72 shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-bold text-gray-900 mb-4">
                Ringkasan Pesanan
              </h2>

              <div className="flex flex-col gap-3 mb-4">
                {keranjang.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-700">
                      {item.nama}{" "}
                      <span className="text-gray-400">x{item.jumlah}</span>
                    </span>
                    <span className="text-gray-900">
                      Rp {(item.harga * item.jumlah).toLocaleString("id-ID")}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Subtotal</span>
                  <span>Rp {totalHarga.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-4">
                  <span>Ongkir</span>
                  <span className="text-green-600">Gratis</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900">
                  <span>Total</span>
                  <span>Rp {totalHarga.toLocaleString("id-ID")}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-black text-white py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50"
              >
                {loading ? "Memproses..." : "Buat Pesanan"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
