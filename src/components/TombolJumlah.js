"use client";

import { useState } from "react";
import { useKeranjang } from "@/context/KeranjangContext";

export default function TombolJumlah({ produk }) {
  const { tambahKeKeranjang } = useKeranjang();
  const [jumlah, setJumlah] = useState(1);
  const [ditambahkan, setDitambahkan] = useState(false);

  const kurang = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (jumlah > 1) setJumlah(jumlah - 1);
  };

  const tambah = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (jumlah < produk.stok) setJumlah(jumlah + 1);
  };

  const handleTambahKeranjang = (e) => {
    e.preventDefault();
    e.stopPropagation();

    for (let i = 0; i < jumlah; i++) {
      tambahKeKeranjang({
        id: produk.id,
        nama: produk.nama,
        harga: produk.harga,
        kategori: produk.kategori,
        gambar: produk.gambar,
      });
    }

    setDitambahkan(true);
    setJumlah(1);
    setTimeout(() => setDitambahkan(false), 2000);
  };

  if (produk.stok === 0) {
    return (
      <div className="mt-3">
        <button
          disabled
          className="w-full bg-gray-100 text-gray-400 py-2 rounded-lg text-xs font-medium cursor-not-allowed"
        >
          Stok Habis
        </button>
      </div>
    );
  }

  return (
    <div className="mt-3" onClick={(e) => e.preventDefault()}>
      {/* Kontrol jumlah */}
      <div className="flex items-center gap-2 mb-2">
        <button
          onClick={kurang}
          className="w-7 h-7 border border-gray-200 rounded-full text-sm text-gray-600 hover:bg-gray-50 flex items-center justify-center shrink-0"
        >
          −
        </button>
        <span className="flex-1 text-center text-sm font-medium text-gray-900">
          {jumlah}
        </span>
        <button
          onClick={tambah}
          disabled={jumlah >= produk.stok}
          className="w-7 h-7 border border-gray-200 rounded-full text-sm text-gray-600 hover:bg-gray-50 flex items-center justify-center shrink-0 disabled:opacity-40"
        >
          +
        </button>
        <span className="text-xs text-gray-400 shrink-0">
          / {produk.stok} pcs
        </span>
      </div>

      {/* Tombol tambah keranjang */}
      <button
        onClick={handleTambahKeranjang}
        className={`w-full py-2 rounded-lg text-xs font-medium transition ${
          ditambahkan
            ? "bg-green-500 text-white"
            : "bg-black text-white hover:bg-gray-800"
        }`}
      >
        {ditambahkan ? "✓ Ditambahkan!" : "+ Keranjang"}
      </button>
    </div>
  );
}
