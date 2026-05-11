"use client";

import { useState, useEffect } from "react";
import { useKeranjang } from "@/context/KeranjangContext";

export default function ModalProduk({ produk, onClose }) {
  const { tambahKeKeranjang } = useKeranjang();
  const [ukuranDipilih, setUkuranDipilih] = useState("");
  const [jumlah, setJumlah] = useState(1);
  const [error, setError] = useState("");
  const [sukses, setSukses] = useState(false);

  const punyaUkuran = produk.ukurans && produk.ukurans.length > 0;
  const URUTAN_UKURAN = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

  // Cek stok berdasarkan ukuran yang dipilih
  const stokTersedia = punyaUkuran
    ? produk.ukurans.find((u) => u.ukuran === ukuranDipilih)?.stok || 0
    : produk.stok;

  // Tutup modal dengan tombol Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Cegah scroll background saat modal terbuka
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handlePilihUkuran = (ukuran, stok) => {
    if (stok === 0) return;
    setUkuranDipilih(ukuran);
    setJumlah(1);
    setError("");
  };

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
    setTimeout(() => {
      setSukses(false);
      onClose();
    }, 1500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
      onClick={onClose}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />

      {/* Modal */}
      <div
        className="relative bg-white w-full md:max-w-md rounded-t-2xl md:rounded-2xl p-6 z-10 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tombol tutup */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 text-sm"
        >
          ✕
        </button>

        {/* Info produk */}
        <div className="flex gap-4 mb-6">
          <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden shrink-0">
            {produk.gambar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={produk.gambar}
                alt={produk.nama}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gray-300 text-xs">📷</span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400 uppercase mb-1">
              {produk.kategori}
            </p>
            <h3 className="font-bold text-gray-900 text-base leading-snug mb-1">
              {produk.nama}
            </h3>
            <p className="text-green-600 font-bold text-lg">
              Rp {produk.harga.toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        {/* Pilih ukuran */}
        {punyaUkuran && (
          <div className="mb-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-900">Pilih Ukuran</p>
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
                    onClick={() => handlePilihUkuran(u.ukuran, u.stok)}
                    disabled={u.stok === 0}
                    className={`relative px-4 py-2.5 rounded-xl text-sm font-medium border-2 transition ${
                      u.stok === 0
                        ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed"
                        : ukuranDipilih === u.ukuran
                          ? "bg-black text-white border-black"
                          : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    {u.ukuran}
                    {u.stok === 0 && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="w-full h-px bg-gray-300 rotate-45 absolute"></span>
                      </span>
                    )}
                    {u.stok > 0 && u.stok <= 3 && (
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-yellow-400 text-yellow-900 text-xs rounded-full flex items-center justify-center font-bold">
                        {u.stok}
                      </span>
                    )}
                  </button>
                ))}
            </div>

            {error && <p className="text-xs text-red-500 mt-2">{error}</p>}

            {/* Info stok ukuran dipilih */}
            {ukuranDipilih && stokTersedia > 0 && (
              <p className="text-xs text-gray-400 mt-2">
                Stok ukuran {ukuranDipilih}:{" "}
                <strong className="text-gray-600">{stokTersedia} pcs</strong>
              </p>
            )}
          </div>
        )}

        {/* Pilih jumlah */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-900 mb-3">Jumlah</p>
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
              Stok:{" "}
              <strong className="text-gray-600">{stokTersedia} pcs</strong>
            </p>
          </div>
        </div>

        {/* Subtotal */}
        <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3 mb-4">
          <span className="text-sm text-gray-500">Subtotal</span>
          <span className="font-bold text-gray-900">
            Rp {(produk.harga * jumlah).toLocaleString("id-ID")}
          </span>
        </div>

        {/* Tombol tambah keranjang */}
        <button
          onClick={handleTambahKeranjang}
          disabled={produk.stok === 0}
          className={`w-full py-3.5 rounded-xl text-sm font-medium transition ${
            sukses
              ? "bg-green-500 text-white"
              : produk.stok === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800"
          }`}
        >
          {sukses
            ? "✓ Berhasil ditambahkan!"
            : produk.stok === 0
              ? "Stok Habis"
              : "+ Masukkan Keranjang"}
        </button>
      </div>
    </div>
  );
}
