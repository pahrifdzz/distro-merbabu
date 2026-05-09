"use client";

import { useKeranjang } from "@/context/KeranjangContext";

export default function TombolKeranjang({ produk }) {
  const { tambahKeKeranjang } = useKeranjang();

  const handleTambah = () => {
    tambahKeKeranjang({
      id: produk.id,
      nama: produk.nama,
      harga: produk.harga,
      kategori: produk.kategori,
      gambar: produk.gambar,
    });
    alert(`${produk.nama} ditambahkan ke keranjang!`);
  };

  if (produk.stok === 0) {
    return (
      <button
        disabled
        className="bg-gray-200 text-gray-400 px-8 py-3 rounded-full cursor-not-allowed text-sm"
      >
        Stok Habis
      </button>
    );
  }

  return (
    <button
      onClick={handleTambah}
      className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition"
    >
      + Masukkan Keranjang
    </button>
  );
}
