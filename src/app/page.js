"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import KartuProduk from "@/components/KartuProduk";

const KATEGORI = ["Semua", "Kaos", "Hoodie", "Jaket", "Celana", "Aksesoris"];

export default function Home() {
  const [produk, setProduk] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [kategori, setKategori] = useState("Semua");

  useEffect(() => {
    fetch("/api/produk")
      .then((res) => res.json())
      .then((data) => {
        setProduk(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  // Filter produk berdasarkan search dan kategori
  const produkFiltered = produk.filter((item) => {
    const cocokSearch =
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.kategori.toLowerCase().includes(search.toLowerCase()) ||
      (item.deskripsi &&
        item.deskripsi.toLowerCase().includes(search.toLowerCase()));
    const cocokKategori = kategori === "Semua" || item.kategori === kategori;
    return cocokSearch && cocokKategori;
  });

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-10">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Koleksi Terbaru
        </h1>
        <p className="text-gray-600 mb-6 text-sm md:text-base">
          Pakaian outdoor & streetwear berkualitas tinggi
        </p>

        {/* Search bar */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-gray-400"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Cari produk, kategori..."
            className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-black"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter kategori */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {KATEGORI.map((k) => (
            <button
              key={k}
              onClick={() => setKategori(k)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition ${
                kategori === k
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
              }`}
            >
              {k}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-3 bg-gray-200 rounded mb-2 w-16"></div>
                  <div className="h-4 bg-gray-200 rounded mb-3 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Hasil produk */}
        {!loading && produkFiltered.length > 0 && (
          <>
            {/* Info hasil pencarian */}
            {(search || kategori !== "Semua") && (
              <p className="text-sm text-gray-500 mb-4">
                Menampilkan{" "}
                <strong className="text-gray-900">
                  {produkFiltered.length}
                </strong>{" "}
                produk
                {search && (
                  <span>
                    {" "}
                    untuk "<strong className="text-gray-900">{search}</strong>"
                  </span>
                )}
                {kategori !== "Semua" && (
                  <span>
                    {" "}
                    di kategori{" "}
                    <strong className="text-gray-900">{kategori}</strong>
                  </span>
                )}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {produkFiltered.map((item) => (
                <KartuProduk
                  key={item.id}
                  id={item.id}
                  nama={item.nama}
                  harga={item.harga.toLocaleString("id-ID")}
                  kategori={item.kategori}
                  gambar={item.gambar}
                  stok={item.stok}
                  ukurans={item.ukurans}
                />
              ))}
            </div>
          </>
        )}

        {/* Tidak ada hasil */}
        {!loading && produkFiltered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-4">🔍</p>
            <h3 className="font-bold text-gray-900 mb-2">
              Produk tidak ditemukan
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              Tidak ada produk yang cocok dengan pencarian kamu
            </p>
            <button
              onClick={() => {
                setSearch("");
                setKategori("Semua");
              }}
              className="bg-black text-white px-6 py-2.5 rounded-full text-sm hover:bg-gray-800"
            >
              Reset Pencarian
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
