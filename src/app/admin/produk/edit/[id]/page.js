"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";

const PILIHAN_UKURAN = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

export default function EditProdukPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [form, setForm] = useState({
    nama: "",
    harga: "",
    kategori: "",
    deskripsi: "",
    stok: "",
  });
  const [ukurans, setUkurans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/admin/produk/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setForm({
          nama: data.nama,
          harga: data.harga,
          kategori: data.kategori,
          deskripsi: data.deskripsi || "",
          stok: data.stok ?? 0,
        });
        setUkurans(data.ukurans || []);
        setFetching(false);
      });
  }, [id]);

  const toggleUkuran = (ukuran) => {
    const sudahAda = ukurans.find((u) => u.ukuran === ukuran);
    if (sudahAda) {
      setUkurans((prev) => prev.filter((u) => u.ukuran !== ukuran));
    } else {
      setUkurans((prev) => [...prev, { ukuran, stok: 0 }]);
    }
  };

  const updateStokUkuran = (ukuran, stok) => {
    setUkurans((prev) =>
      prev.map((u) =>
        u.ukuran === ukuran ? { ...u, stok: parseInt(stok) || 0 } : u,
      ),
    );
  };

  const handleSubmit = async () => {
    if (!form.nama || !form.harga || !form.kategori) {
      setError("Nama, harga, dan kategori wajib diisi");
      return;
    }

    setLoading(true);

    const totalStok =
      ukurans.length > 0
        ? ukurans.reduce((acc, u) => acc + u.stok, 0)
        : parseInt(form.stok) || 0;

    const res = await fetch(`/api/admin/produk/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nama: form.nama,
        harga: parseInt(form.harga),
        kategori: form.kategori,
        deskripsi: form.deskripsi,
        stok: totalStok,
        ukurans,
      }),
    });

    if (!res.ok) {
      setError("Gagal mengupdate produk");
      setLoading(false);
      return;
    }

    router.push("/admin/produk");
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-gray-400 text-sm">Memuat data produk...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Produk</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-lg">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3 mb-4">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-gray-800 block mb-1">
              Nama Produk
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-black"
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-800 block mb-1">
              Harga (Rp)
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Contoh: 140000"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-black"
              value={form.harga}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, "");
                setForm({ ...form, harga: val });
              }}
            />
          </div>

          {/* Ukuran & stok */}
          <div>
            <label className="text-sm font-medium text-gray-800 block mb-1">
              Ukuran & Stok
              <span className="text-gray-400 font-normal ml-1">(opsional)</span>
            </label>

            <div className="flex flex-wrap gap-2 mb-3">
              {PILIHAN_UKURAN.map((ukuran) => {
                const dipilih = ukurans.find((u) => u.ukuran === ukuran);
                return (
                  <button
                    key={ukuran}
                    type="button"
                    onClick={() => toggleUkuran(ukuran)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition ${
                      dipilih
                        ? "bg-black text-white border-black"
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    {ukuran}
                  </button>
                );
              })}
            </div>

            {ukurans.length > 0 && (
              <div className="flex flex-col gap-2 bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">
                  Atur stok tiap ukuran:
                </p>
                {ukurans
                  .sort(
                    (a, b) =>
                      PILIHAN_UKURAN.indexOf(a.ukuran) -
                      PILIHAN_UKURAN.indexOf(b.ukuran),
                  )
                  .map((u) => (
                    <div key={u.ukuran} className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-900 w-12">
                        {u.ukuran}
                      </span>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-black"
                        value={u.stok === 0 ? "" : u.stok}
                        onChange={(e) =>
                          updateStokUkuran(
                            u.ukuran,
                            e.target.value === "" ? 0 : e.target.value,
                          )
                        }
                      />
                      <span className="text-xs text-gray-400">pcs</span>
                    </div>
                  ))}
                <p className="text-xs text-gray-400 mt-1">
                  Total stok:{" "}
                  <strong className="text-gray-700">
                    {ukurans.reduce((acc, u) => acc + u.stok, 0)} pcs
                  </strong>
                </p>
              </div>
            )}

            {ukurans.length === 0 && (
              <div>
                <input
                  type="number"
                  min="0"
                  placeholder="Stok tanpa ukuran"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-black"
                  value={form.stok}
                  onChange={(e) => setForm({ ...form, stok: e.target.value })}
                />
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-800 block mb-1">
              Kategori
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-black"
              value={form.kategori}
              onChange={(e) => setForm({ ...form, kategori: e.target.value })}
            >
              <option value="">Pilih kategori</option>
              <option value="Kaos">Kaos</option>
              <option value="Hoodie">Hoodie</option>
              <option value="Jaket">Jaket</option>
              <option value="Celana">Celana</option>
              <option value="Aksesoris">Aksesoris</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-800 block mb-1">
              Deskripsi
            </label>
            <textarea
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-black resize-none"
              value={form.deskripsi}
              onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
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
