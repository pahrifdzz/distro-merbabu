"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";

export default function HapusProdukPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [produk, setProduk] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/produk/${id}`)
      .then((res) => res.json())
      .then((data) => setProduk(data));
  }, [id]);

  const handleHapus = async () => {
    setLoading(true);

    const res = await fetch(`/api/admin/produk/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.push("/admin/produk");
    } else {
      alert("Gagal menghapus produk");
      setLoading(false);
    }
  };

  if (!produk) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-gray-400 text-sm">Memuat data produk...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Hapus Produk</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-lg">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-sm font-medium text-red-800 mb-1">
            ⚠️ Peringatan!
          </p>
          <p className="text-sm text-red-600">
            Tindakan ini tidak bisa dibatalkan. Produk akan dihapus permanen
            dari database.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-500 mb-1">
            Produk yang akan dihapus:
          </p>
          <p className="font-semibold text-gray-900">{produk.nama}</p>
          <p className="text-sm text-gray-600">
            {produk.kategori} — Rp {produk.harga?.toLocaleString("id-ID")}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleHapus}
            disabled={loading}
            className="bg-red-500 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-red-600 disabled:opacity-50"
          >
            {loading ? "Menghapus..." : "Ya, Hapus Produk"}
          </button>
          <button
            onClick={() => router.back()}
            className="border border-gray-200 text-gray-700 px-6 py-2.5 rounded-lg text-sm hover:bg-gray-50"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}
