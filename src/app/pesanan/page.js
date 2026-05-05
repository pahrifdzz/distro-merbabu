"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function PesananSayaPage() {
  const [pesanan, setPesanan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [terbuka, setTerbuka] = useState(null);

  useEffect(() => {
    fetch("/api/pesanan/user")
      .then((res) => res.json())
      .then((data) => {
        setPesanan(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  const warnaBadge = (status) => {
    if (status === "pending") return "bg-yellow-100 text-yellow-700";
    if (status === "diproses") return "bg-blue-100 text-blue-700";
    if (status === "selesai") return "bg-green-100 text-green-700";
    return "bg-gray-100 text-gray-700";
  };

  const pesanWhatsApp = (p) => {
    const pesan = `Halo Admin Distro Merbabu! 👋\n\nSaya ingin konfirmasi pembayaran:\n\n🧾 ID Pesanan: #${p.id}\n👤 Nama: ${p.namaPenerima}\n💰 Total: Rp ${p.total.toLocaleString("id-ID")}\n\nSaya sudah melakukan transfer ke rekening BCA 1123344500. Mohon segera dikonfirmasi. Terima kasih!`;
    window.open(
      `https://wa.me/6285155162264?text=${encodeURIComponent(pesan)}`,
      "_blank",
    );
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-8 md:py-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/profil"
            className="text-gray-400 hover:text-black text-sm"
          >
            ← Profil
          </Link>
          <span className="text-gray-300">/</span>
          <h1 className="text-xl font-bold text-gray-900">Pesanan Saya</h1>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <p className="text-gray-400 text-sm">Memuat pesanan...</p>
          </div>
        )}

        {/* Kosong */}
        {!loading && pesanan.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-4xl mb-4">📦</p>
            <h2 className="font-bold text-gray-900 mb-2">Belum ada pesanan</h2>
            <p className="text-gray-500 text-sm mb-6">
              Yuk mulai belanja produk Distro Merbabu!
            </p>
            <Link
              href="/"
              className="bg-black text-white px-6 py-2.5 rounded-full text-sm hover:bg-gray-800"
            >
              Lihat Produk
            </Link>
          </div>
        )}

        {/* Daftar pesanan */}
        {!loading && pesanan.length > 0 && (
          <div className="flex flex-col gap-4">
            {pesanan.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
              >
                {/* Header pesanan */}
                <div
                  className="p-4 md:p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                  onClick={() => setTerbuka(terbuka === p.id ? null : p.id)}
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-900 text-sm">
                          Pesanan #{p.id}
                        </p>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${warnaBadge(p.status)}`}
                        >
                          {p.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">
                        {new Date(p.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}{" "}
                        · {p.items.length} item
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-bold text-gray-900 text-sm">
                      Rp {p.total.toLocaleString("id-ID")}
                    </p>
                    <span className="text-gray-400 text-xs">
                      {terbuka === p.id ? "▲" : "▼"}
                    </span>
                  </div>
                </div>

                {/* Detail pesanan — expandable */}
                {terbuka === p.id && (
                  <div className="border-t border-gray-100 p-4 md:p-5">
                    {/* Info pengiriman */}
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <p className="text-xs text-gray-400 uppercase font-medium mb-2">
                        Info Pengiriman
                      </p>
                      <p className="text-sm text-gray-700">{p.namaPenerima}</p>
                      <p className="text-sm text-gray-500">{p.alamat}</p>
                      <p className="text-sm text-gray-500">{p.telepon}</p>
                    </div>

                    {/* Item pesanan */}
                    <p className="text-xs text-gray-400 uppercase font-medium mb-3">
                      Item Pesanan
                    </p>
                    <div className="flex flex-col gap-3 mb-4">
                      {p.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                            {item.produk?.gambar ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={item.produk.gambar}
                                alt={item.produk.nama}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-gray-300 text-xs">?</span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {item.produk?.nama}
                            </p>
                            <p className="text-xs text-gray-500">
                              x{item.jumlah} · Rp{" "}
                              {item.harga.toLocaleString("id-ID")}
                            </p>
                          </div>
                          <p className="text-sm font-semibold text-gray-900 shrink-0">
                            Rp{" "}
                            {(item.harga * item.jumlah).toLocaleString("id-ID")}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Total */}
                    <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900 mb-4">
                      <span>Total</span>
                      <span>Rp {p.total.toLocaleString("id-ID")}</span>
                    </div>

                    {/* Status info */}
                    <div
                      className={`rounded-lg p-3 mb-4 text-sm ${
                        p.status === "pending"
                          ? "bg-yellow-50 border border-yellow-200 text-yellow-700"
                          : p.status === "diproses"
                            ? "bg-blue-50 border border-blue-200 text-blue-700"
                            : "bg-green-50 border border-green-200 text-green-700"
                      }`}
                    >
                      {p.status === "pending" &&
                        "⏳ Menunggu konfirmasi pembayaran dari admin."}
                      {p.status === "diproses" &&
                        "📦 Pembayaran dikonfirmasi, pesanan sedang diproses."}
                      {p.status === "selesai" &&
                        "✅ Pesanan selesai. Terima kasih sudah berbelanja!"}
                    </div>

                    {/* Tombol aksi */}
                    {p.status === "pending" && (
                      <button
                        onClick={() => pesanWhatsApp(p)}
                        className="w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
                        style={{ background: "#25D366", color: "#fff" }}
                      >
                        💬 Hubungi Admin via WhatsApp
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
