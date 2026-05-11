"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase";

const PILIHAN_UKURAN = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

export default function TambahProdukPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    nama: "",
    harga: "",
    kategori: "",
    deskripsi: "",
    stok: "",
  });
  const [fotos, setFotos] = useState([]);
  const [ukurans, setUkurans] = useState([]); // [{ ukuran: 'S', stok: 10 }]
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTambahFoto = (e) => {
    const files = Array.from(e.target.files);
    const fotosBaru = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setFotos((prev) => [...prev, ...fotosBaru]);
    e.target.value = "";
  };

  const hapusFoto = (index) => {
    setFotos((prev) => prev.filter((_, i) => i !== index));
  };

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
    let gambarUtama = null;
    const urlFotos = [];

    for (const foto of fotos) {
      const namaFile = `${Date.now()}-${foto.file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("produk-images")
        .upload(namaFile, foto.file);

      if (uploadError) {
        setError("Gagal upload foto: " + uploadError.message);
        setLoading(false);
        return;
      }

      const { data } = supabase.storage
        .from("produk-images")
        .getPublicUrl(namaFile);
      urlFotos.push(data.publicUrl);
      if (!gambarUtama) gambarUtama = data.publicUrl;
    }

    // Hitung total stok dari ukuran kalau ada
    const totalStok =
      ukurans.length > 0
        ? ukurans.reduce((acc, u) => acc + u.stok, 0)
        : parseInt(form.stok) || 0;

    const res = await fetch("/api/admin/produk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nama: form.nama,
        harga: parseInt(form.harga),
        kategori: form.kategori,
        deskripsi: form.deskripsi,
        stok: totalStok,
        gambar: gambarUtama,
        fotos: urlFotos,
        ukurans,
      }),
    });

    if (!res.ok) {
      setError("Gagal menambah produk");
      setLoading(false);
      return;
    }

    router.push("/admin/produk");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Tambah Produk</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-lg">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3 mb-4">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          {/* Upload foto */}
          <div>
            <label className="text-sm font-medium text-gray-800 block mb-1">
              Foto Produk
              <span className="text-gray-400 font-normal ml-1">
                (bisa lebih dari 1)
              </span>
            </label>
            {fotos.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-3">
                {fotos.map((foto, index) => (
                  <div key={index} className="relative group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={foto.preview}
                      alt={`foto ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-gray-200"
                    />
                    {index === 0 && (
                      <span className="absolute top-1 left-1 bg-black text-white text-xs px-1.5 py-0.5 rounded">
                        Utama
                      </span>
                    )}
                    <button
                      onClick={() => hapusFoto(index)}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <div
                  onClick={() => document.getElementById("inputFoto").click()}
                  className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition"
                >
                  <span className="text-2xl text-gray-300">+</span>
                </div>
              </div>
            )}
            {fotos.length === 0 && (
              <div
                onClick={() => document.getElementById("inputFoto").click()}
                className="w-full h-36 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition mb-3"
              >
                <div className="text-center">
                  <p className="text-3xl mb-1">📷</p>
                  <p className="text-sm text-gray-400">
                    Klik untuk upload foto
                  </p>
                  <p className="text-xs text-gray-300 mt-1">
                    Bisa pilih beberapa foto sekaligus
                  </p>
                </div>
              </div>
            )}
            <input
              id="inputFoto"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleTambahFoto}
            />
          </div>

          {/* Nama produk */}
          <div>
            <label className="text-sm font-medium text-gray-800 block mb-1">
              Nama Produk
            </label>
            <input
              type="text"
              placeholder="Masukkan nama produk"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-black"
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
            />
          </div>

          {/* Harga */}
          <div>
            <label className="text-sm font-medium text-gray-800 block mb-1">
              Harga (Rp)
            </label>
            <input
              type="number"
              placeholder="Contoh: 120000"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-black"
              value={form.harga}
              onChange={(e) => setForm({ ...form, harga: e.target.value })}
            />
          </div>

          {/* Ukuran & stok per ukuran */}
          <div>
            <label className="text-sm font-medium text-gray-800 block mb-1">
              Ukuran & Stok
              <span className="text-gray-400 font-normal ml-1">(opsional)</span>
            </label>

            {/* Pilih ukuran */}
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

            {/* Input stok per ukuran */}
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
                        placeholder="Stok"
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-black"
                        value={u.stok}
                        onChange={(e) =>
                          updateStokUkuran(u.ukuran, e.target.value)
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

            {/* Stok manual kalau tidak pakai ukuran */}
            {ukurans.length === 0 && (
              <div>
                <input
                  type="number"
                  min="0"
                  placeholder="Masukkan jumlah stok (tanpa ukuran)"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-black"
                  value={form.stok}
                  onChange={(e) => setForm({ ...form, stok: e.target.value })}
                />
                <p className="text-xs text-gray-400 mt-1">
                  Pilih ukuran di atas untuk atur stok per ukuran
                </p>
              </div>
            )}
          </div>

          {/* Kategori */}
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

          {/* Deskripsi */}
          <div>
            <label className="text-sm font-medium text-gray-800 block mb-1">
              Deskripsi
            </label>
            <textarea
              placeholder="Masukkan deskripsi produk"
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-black resize-none"
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
              {loading ? "Menyimpan..." : "Simpan Produk"}
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
