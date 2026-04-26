"use client";

import { createContext, useContext, useState } from "react";

const KeranjangContext = createContext();

export function KeranjangProvider({ children }) {
  const [keranjang, setKeranjang] = useState([]);

  // Tambah produk ke keranjang
  const tambahKeKeranjang = (produk) => {
    setKeranjang((prev) => {
      const sudahAda = prev.find((item) => item.id === produk.id);
      if (sudahAda) {
        // Kalau sudah ada, tambah jumlahnya
        return prev.map((item) =>
          item.id === produk.id ? { ...item, jumlah: item.jumlah + 1 } : item,
        );
      }
      // Kalau belum ada, tambah sebagai item baru
      return [...prev, { ...produk, jumlah: 1 }];
    });
  };

  // Hapus produk dari keranjang
  const hapusDariKeranjang = (id) => {
    setKeranjang((prev) => prev.filter((item) => item.id !== id));
  };

  // Ubah jumlah produk
  const ubahJumlah = (id, jumlah) => {
    if (jumlah < 1) return;
    setKeranjang((prev) =>
      prev.map((item) => (item.id === id ? { ...item, jumlah } : item)),
    );
  };

  // Hitung total harga
  const totalHarga = keranjang.reduce(
    (total, item) => total + item.harga * item.jumlah,
    0,
  );

  // Hitung total item
  const totalItem = keranjang.reduce((total, item) => total + item.jumlah, 0);

  // Kosongkan keranjang
  const kosongkanKeranjang = () => setKeranjang([]);

  return (
    <KeranjangContext.Provider
      value={{
        keranjang,
        tambahKeKeranjang,
        hapusDariKeranjang,
        ubahJumlah,
        totalHarga,
        totalItem,
        kosongkanKeranjang,
      }}
    >
      {children}
    </KeranjangContext.Provider>
  );
}

export function useKeranjang() {
  return useContext(KeranjangContext);
}
