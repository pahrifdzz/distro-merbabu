"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";

export default function EditZonaPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [form, setForm] = useState({
    namaZona: "",
    wilayah: "",
    biaya: "",
    estimasi: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/admin/ongkir/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setForm({
          namaZona: data.namaZona,
          wilayah: data.wilayah,
          biaya: data.biaya,
          estimasi: data.estimasi,
        });
        setFetching(false);
      });
  }, [id]);

  const handleSubmit = async () => {
    if (
      !form.namaZona ||
      !form.wilayah ||
      form.biaya === "" ||
      !form.estimasi
    ) {
      setError("Semua field wajib diisi");
      return;
    }

    setLoading(true);

    const res = await fetch(`/api/admin/ongkir/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, biaya: parseInt(form.biaya) }),
    });

    if (!res.ok) {
      setError("Gagal mengupdate zona");
      setLoading(false);
      return;
    }

    router.push("/admin/ongkir");
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-gray-400 text-sm">Memuat data zona...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Edit Zona Ongkir
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
              Nama Zona
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-black"
              value={form.namaZona}
              onChange={(e) => setForm({ ...form, namaZona: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-800 block mb-1">
              Wilayah yang Tercakup
            </label>
            <textarea
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-black resize-none"
              value={form.wilayah}
              onChange={(e) => setForm({ ...form, wilayah: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-800 block mb-1">
              Biaya Ongkir (Rp)
            </label>
            <input
              type="number"
              min="0"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-black"
              value={form.biaya === 0 ? "" : form.biaya}
              onChange={(e) =>
                setForm({
                  ...form,
                  biaya: e.target.value === "" ? 0 : e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-800 block mb-1">
              Estimasi Pengiriman
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-black"
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
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
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
