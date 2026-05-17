"use client";

import { useState } from "react";
import { useKeranjang } from "@/context/KeranjangContext";

const URUTAN_UKURAN = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

export default function TombolKeranjang({ produk }) {
  const { tambahKeKeranjang } = useKeranjang();
  const [ukuranDipilih, setUkuranDipilih] = useState("");
  const [jumlah, setJumlah] = useState(1);
  const [error, setError] = useState("");
  const [sukses, setSukses] = useState(false);

  const punyaUkuran = produk.ukurans && produk.ukurans.length > 0;

  const stokTersedia = punyaUkuran
    ? produk.ukurans.find((u) => u.ukuran === ukuranDipilih)?.stok || 0
    : produk.stok;

  const kurang = () => {
    if (jumlah > 1) setJumlah(jumlah - 1);
  };
  const tambah = () => {
    if (jumlah < stokTersedia) setJumlah(jumlah + 1);
  };

  const handleTambahKeranjang = () => {
    if (punyaUkuran && !ukuranDipilih) {
      setError("Pilih ukuran terlebih dahulu!");
      return;
    }

    for (let i = 0; i < jumlah; i++) {
      tambahKeKeranjang({
        id: produk.id,
        nama: produk.nama,
        harga: produk.harga,
        kategori: produk.kategori,
        gambar: produk.gambar,
        ukuran: ukuranDipilih || null,
      });
    }

    setSukses(true);
    setTimeout(() => setSukses(false), 2000);
  };

  if (produk.stok === 0) {
    return (
      <button
        disabled
        className="w-full bg-gray-200 text-gray-400 py-3.5 rounded-xl text-sm font-medium cursor-not-allowed"
      >
        Stok Habis
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Pilih ukuran */}
      {punyaUkuran && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-gray-900">Pilih Ukuran</p>
            {ukuranDipilih && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                Dipilih: <strong>{ukuranDipilih}</strong>
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {produk.ukurans
              .sort(
                (a, b) =>
                  URUTAN_UKURAN.indexOf(a.ukuran) -
                  URUTAN_UKURAN.indexOf(b.ukuran),
              )
              .map((u) => (
                <button
                  key={u.ukuran}
                  onClick={() => {
                    setUkuranDipilih(u.ukuran);
                    setJumlah(1);
                    setError("");
                  }}
                  disabled={u.stok === 0}
                  className={`relative px-4 py-2.5 rounded-xl text-sm font-medium border-2 transition ${
                    u.stok === 0
                      ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed line-through"
                      : ukuranDipilih === u.ukuran
                        ? "bg-black text-white border-black"
                        : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                  }`}
                >
                  {u.ukuran}
                  {u.stok > 0 && u.stok <= 3 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-yellow-400 text-yellow-900 text-xs rounded-full flex items-center justify-center font-bold">
                      {u.stok}
                    </span>
                  )}
                </button>
              ))}
          </div>

          {/* Info stok ukuran dipilih */}
          {ukuranDipilih && stokTersedia > 0 && (
            <p className="text-xs text-gray-400 mt-2">
              Stok ukuran {ukuranDipilih}:{" "}
              <strong className="text-gray-600">{stokTersedia} pcs</strong>
            </p>
          )}

          {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
        </div>
      )}

      {/* Pilih jumlah */}
      <div>
        <p className="text-sm font-semibold text-gray-900 mb-2">Jumlah</p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 border border-gray-200 rounded-xl p-1">
            <button
              onClick={kurang}
              disabled={jumlah <= 1}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed font-medium text-lg"
            >
              −
            </button>
            <span className="w-8 text-center font-bold text-gray-900">
              {jumlah}
            </span>
            <button
              onClick={tambah}
              disabled={
                jumlah >= stokTersedia || (punyaUkuran && !ukuranDipilih)
              }
              className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed font-medium text-lg"
            >
              +
            </button>
          </div>
          <p className="text-sm text-gray-400">
            Stok: <strong className="text-gray-600">{stokTersedia} pcs</strong>
          </p>
        </div>
      </div>

      {/* Subtotal */}
      <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
        <span className="text-sm text-gray-500">Subtotal</span>
        <span className="font-bold text-gray-900">
          Rp {(produk.harga * jumlah).toLocaleString("id-ID")}
        </span>
      </div>

      {/* Tombol tambah keranjang */}
      <button
        onClick={handleTambahKeranjang}
        className={`w-full py-3.5 rounded-xl text-sm font-medium transition ${
          sukses
            ? "bg-green-500 text-white"
            : "bg-black text-white hover:bg-gray-800"
        }`}
      >
        {sukses ? "✓ Berhasil ditambahkan!" : "+ Masukkan Keranjang"}
      </button>
    </div>
  );
}
