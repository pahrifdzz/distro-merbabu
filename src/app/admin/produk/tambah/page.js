"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase";
import Image from "next/image";
import imageCompression from "browser-image-compression";

export default function TambahProdukPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    nama: "",
    harga: "",
    kategori: "",
    deskripsi: "",
    stok: "",
  });
  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validasi tipe file
    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar!");
      return;
    }

    // Kompres otomatis sebelum upload
    const options = {
      maxSizeMB: 0.5, // maksimal 500KB setelah dikompres
      maxWidthOrHeight: 800, // maksimal 800px
      useWebWorker: true,
    };

    try {
      const fileTerkompres = await imageCompression(file, options);
      setFoto(fileTerkompres);
      setPreview(URL.createObjectURL(fileTerkompres));
      setError("");
    } catch (err) {
      setError("Gagal memproses foto");
    }
  };

  const handleSubmit = async () => {
    if (!form.nama || !form.harga || !form.kategori) {
      setError("Nama, harga, dan kategori wajib diisi");
      return;
    }

    setLoading(true);
    let gambarUrl = null;

    if (foto) {
      const namaFile = `${Date.now()}-${foto.name}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("produk-images")
        .upload(namaFile, foto);

      console.log("Upload result:", uploadData, uploadError);

      if (uploadError) {
        setError("Gagal upload foto: " + uploadError.message);
        setLoading(false);
        return;
      }

      const { data } = supabase.storage
        .from("produk-images")
        .getPublicUrl(namaFile);

      gambarUrl = data.publicUrl;
      console.log("Gambar URL:", gambarUrl);
    }

    console.log("Data yang dikirim:", {
      ...form,
      harga: parseInt(form.harga),
      gambar: gambarUrl,
    });

    const res = await fetch("/api/admin/produk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        harga: parseInt(form.harga),
        stok: parseInt(form.stok) || 0,
        gambar: gambarUrl,
      }),
    });

    const data = await res.json();
    console.log("Response API:", data);

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
            </label>
            <div
              onClick={() => document.getElementById("inputFoto").click()}
              className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition overflow-hidden"
            >
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <p className="text-3xl mb-2">📷</p>
                  <p className="text-sm text-gray-400">
                    Klik untuk upload foto
                  </p>
                </div>
              )}
            </div>
            <input
              id="inputFoto"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFoto}
            />
          </div>

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

          <div>
            <label className="text-sm font-medium text-gray-800 block mb-1">
              Harga (Rp)
            </label>
            <div>
              <label className="text-sm font-medium text-gray-800 block mb-1">
                Stok
              </label>
              <input
                type="number"
                placeholder="Masukkan jumlah stok"
                min="0"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-black"
                value={form.stok}
                onChange={(e) => setForm({ ...form, stok: e.target.value })}
              />
            </div>
            <input
              type="number"
              placeholder="Contoh: 120000"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-black"
              value={form.harga}
              onChange={(e) => setForm({ ...form, harga: e.target.value })}
            />
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
