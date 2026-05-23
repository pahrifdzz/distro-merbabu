"use client";

import { createContext, useContext, useState } from "react";

const KeranjangContext = createContext();

export function KeranjangProvider({ children }) {
  const [keranjang, setKeranjang] = useState([]);

  const tambahKeKeranjang = (produk) => {
    setKeranjang((prev) => {
      // Cek berdasarkan id DAN ukuran sekaligus
      const sudahAda = prev.find(
        (item) => item.id === produk.id && item.ukuran === produk.ukuran,
      );
      if (sudahAda) {
        return prev.map((item) =>
          item.id === produk.id && item.ukuran === produk.ukuran
            ? { ...item, jumlah: item.jumlah + 1 }
            : item,
        );
      }
      return [...prev, { ...produk, jumlah: 1 }];
    });
  };

  const hapusDariKeranjang = (id, ukuran) => {
    setKeranjang((prev) =>
      prev.filter((item) => !(item.id === id && item.ukuran === ukuran)),
    );
  };

  const ubahJumlah = (id, ukuran, jumlah) => {
    if (jumlah < 1) return;
    setKeranjang((prev) =>
      prev.map((item) =>
        item.id === id && item.ukuran === ukuran ? { ...item, jumlah } : item,
      ),
    );
  };

  const totalHarga = keranjang.reduce(
    (total, item) => total + item.harga * item.jumlah,
    0,
  );

  const totalItem = keranjang.reduce((total, item) => total + item.jumlah, 0);

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
