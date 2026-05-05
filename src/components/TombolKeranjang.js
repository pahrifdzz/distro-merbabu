'use client'

import { useKeranjang } from '@/context/KeranjangContext'

export default function TombolKeranjang({ produk }) {
  const { tambahKeKeranjang } = useKeranjang()

  const handleTambah = () => {
    tambahKeKeranjang({
      id: produk.id,
      nama: produk.nama,
      harga: produk.harga,
      kategori: produk.kategori,
      gambar: produk.gambar,  // ← tambahkan ini
    })
    alert(`${produk.nama} ditambahkan ke keranjang!`)
  }

  return (
    <button
      onClick={handleTambah}
      className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition"
    >
      + Masukkan Keranjang
    </button>
  )
}