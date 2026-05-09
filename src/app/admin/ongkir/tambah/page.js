"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TambahOngkirPage() {
  const router = useRouter();
  const [form, setForm] = useState({ kota: "", biaya: "", estimasi: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!form.kota || form.biaya === "" || !form.estimasi) {
      setError("Semua field wajib diisi");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/admin/ongkir", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, biaya: parseInt(form.biaya) }),
    });

    if (!res.ok) {
      setError("Gagal menambah ongkir");
      setLoading(false);
      return;
    }

    router.push("/admin/ongkir");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Tambah Ongkir Kota
      </h1>

      <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-lg">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3 mb-4">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-gray-800 block mb-1">
              Nama Kota
            </label>
            <input
              type="text"
              placeholder="Contoh: Bandung"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-black"
              value={form.kota}
              onChange={(e) => setForm({ ...form, kota: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-800 block mb-1">
              Biaya Ongkir (Rp)
            </label>
            <input
              type="number"
              min="0"
              placeholder="Masukkan 0 untuk gratis ongkir"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-black"
              value={form.biaya}
              onChange={(e) => setForm({ ...form, biaya: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-800 block mb-1">
              Estimasi Pengiriman
            </label>
            <input
              type="text"
              placeholder="Contoh: 2-3 hari"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-black"
              value={form.estimasi}
              onChange={(e) => setForm({ ...form, estimasi: e.target.value })}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : "Simpan"}
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
    </div>
  );
}
