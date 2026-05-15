"use client";

import { useState, useEffect } from "react";
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
  const [profil, setProfil] = useState(null);
  const [zonaList, setZonaList] = useState([]);
  const [zonaDipilih, setZonaDipilih] = useState(null);
  const [form, setForm] = useState({ nama: "", alamat: "", telepon: "" });

  useEffect(() => {
    fetch("/api/ongkir")
      .then((res) => res.json())
      .then((data) => setZonaList(Array.isArray(data) ? data : []));
  }, []);

  useEffect(() => {
    if (session) {
      fetch("/api/profil")
        .then((res) => res.json())
        .then((data) => setProfil(data));
    }
  }, [session]);

  useEffect(() => {
    if (profil?.telepon && profil?.alamat) {
      setForm({
        nama: profil.nama || "",
        telepon: profil.telepon || "",
        alamat: profil.alamat || "",
      });
    }
  }, [profil]);

  const isiDariProfil = () => {
    if (!profil) return;
    setForm({
      nama: profil.nama || "",
      telepon: profil.telepon || "",
      alamat: profil.alamat || "",
    });
  };

  const totalBayar = totalHarga + (zonaDipilih?.biaya || 0);

  if (keranjang.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-20 text-center">
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
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-20 text-center">
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
    if (!form.nama || !form.alamat || !form.telepon) {
      alert("Semua field informasi pengiriman wajib diisi!");
      return;
    }
    if (!zonaDipilih) {
      alert("Pilih zona pengiriman terlebih dahulu!");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/pesanan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: keranjang,
        total: totalBayar,
        alamat: form.alamat,
        telepon: form.telepon,
        nama: form.nama,
        ongkir: zonaDipilih.biaya,
        kotaTujuan: zonaDipilih.namaZona,
        kurir: `Pengiriman ${zonaDipilih.namaZona}`,
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
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-10">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
          Checkout
        </h1>

        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Form kiri */}
          <div className="flex-1 flex flex-col gap-4">
            {/* Informasi penerima */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900">Informasi Penerima</h2>
                {profil?.telepon && profil?.alamat && (
                  <button
                    onClick={isiDariProfil}
                    className="text-xs bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 transition"
                  >
                    📋 Samakan dengan profil
                  </button>
                )}
              </div>

              {profil && (!profil.telepon || !profil.alamat) && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <p className="text-xs text-yellow-700">
                    💡 Lengkapi{" "}
                    <Link href="/profil" className="underline font-medium">
                      data profil
                    </Link>{" "}
                    kamu agar bisa auto-fill saat checkout!
                  </p>
                </div>
              )}

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
                    placeholder="Masukkan alamat lengkap (nama jalan, nomor, RT/RW, kelurahan, kota)"
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-black resize-none"
                    value={form.alamat}
                    onChange={(e) =>
                      setForm({ ...form, alamat: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Pilih zona pengiriman */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-6">
              <h2 className="font-bold text-gray-900 mb-2">
                🚚 Zona Pengiriman
              </h2>
              <p className="text-xs text-gray-400 mb-4">
                Pilih zona sesuai kota tujuan pengiriman kamu
              </p>

              <div className="flex flex-col gap-3">
                {zonaList.map((zona) => (
                  <button
                    key={zona.id}
                    type="button"
                    onClick={() => setZonaDipilih(zona)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition text-left ${
                      zonaDipilih?.id === zona.id
                        ? "border-black bg-gray-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-gray-900">
                          {zona.namaZona}
                        </p>
                        {zonaDipilih?.id === zona.id && (
                          <span className="text-xs text-green-600 font-medium">
                            ✓ Dipilih
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{zona.wilayah}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        ⏱️ Estimasi: {zona.estimasi}
                      </p>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <p
                        className={`text-sm font-bold ${
                          zona.biaya === 0 ? "text-green-600" : "text-gray-900"
                        }`}
                      >
                        {zona.biaya === 0
                          ? "Gratis"
                          : `Rp ${zona.biaya.toLocaleString("id-ID")}`}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Metode pembayaran */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-6">
              <h2 className="font-bold text-gray-900 mb-4">
                Metode Pembayaran
              </h2>
              <div className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-4 h-4 rounded-full border-2 border-black flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-black"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    Transfer Bank BCA
                  </span>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Nomor Rekening</p>
                  <p className="text-base font-bold text-gray-900 tracking-wider">
                    1123 3445 00
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    a/n Distro Merbabu
                  </p>
                </div>
                <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                  Setelah checkout, kamu akan mendapat instruksi pembayaran
                  lengkap beserta tombol untuk menghubungi admin via WhatsApp.
                </p>
              </div>
            </div>
          </div>

          {/* Ringkasan pesanan */}
          <div className="w-full lg:w-72 shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
              <h2 className="font-bold text-gray-900 mb-4">
                Ringkasan Pesanan
              </h2>

              <div className="flex flex-col gap-3 mb-4">
                {keranjang.map((item) => (
                  <div
                    key={`${item.id}-${item.ukuran}`}
                    className="flex items-center gap-3"
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                      {item.gambar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.gambar}
                          alt={item.nama}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-gray-300 text-xs">?</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 truncate">
                        {item.nama}
                        {item.ukuran && (
                          <span className="text-gray-400 ml-1">
                            ({item.ukuran})
                          </span>
                        )}
                        <span className="text-gray-400 ml-1">
                          x{item.jumlah}
                        </span>
                      </p>
                      <p className="text-sm text-gray-900 font-medium">
                        Rp {(item.harga * item.jumlah).toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 mb-6 flex flex-col gap-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal produk</span>
                  <span>Rp {totalHarga.toLocaleString("id-ID")}</span>
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                  <span>Ongkir</span>
                  {zonaDipilih ? (
                    <span
                      className={
                        zonaDipilih.biaya === 0 ? "text-green-600" : ""
                      }
                    >
                      {zonaDipilih.biaya === 0
                        ? "Gratis"
                        : `Rp ${zonaDipilih.biaya.toLocaleString("id-ID")}`}
                    </span>
                  ) : (
                    <span className="text-gray-400 text-xs">Belum dipilih</span>
                  )}
                </div>

                {zonaDipilih && (
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{zonaDipilih.namaZona}</span>
                    <span>Est. {zonaDipilih.estimasi}</span>
                  </div>
                )}

                <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900">
                  <span>Total Bayar</span>
                  <span>Rp {totalBayar.toLocaleString("id-ID")}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading || !zonaDipilih}
                className="w-full bg-black text-white py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50"
              >
                {loading ? "Memproses..." : "Buat Pesanan"}
              </button>

              {!zonaDipilih && (
                <p className="text-xs text-gray-400 text-center mt-2">
                  Pilih zona pengiriman dulu
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
