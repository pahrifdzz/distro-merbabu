"use client";

import { useState } from "react";
import Link from "next/link";
import ModalProduk from "@/components/ModalProduk";

export default function KartuProduk({
  id,
  nama,
  harga,
  kategori,
  gambar,
  stok,
  ukurans,
}) {
  const [modalTerbuka, setModalTerbuka] = useState(false);
  const [hover, setHover] = useState(false);

  const produk = {
    id,
    nama,
    harga:
      typeof harga === "string" ? parseInt(harga.replace(/\./g, "")) : harga,
    kategori,
    gambar,
    stok,
    ukurans: ukurans || [],
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition">
        {/* Foto — klik untuk buka modal */}
        <div
          className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden relative cursor-pointer"
          onClick={() => stok > 0 && setModalTerbuka(true)}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {gambar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={gambar}
              alt={nama}
              className="w-full h-full object-cover transition duration-300"
              style={{ transform: hover ? "scale(1.05)" : "scale(1)" }}
            />
          ) : (
            <span className="text-gray-400 text-sm">Foto Produk</span>
          )}

          {/* Overlay hover */}
          {stok > 0 && (
            <div
              className="absolute inset-0 flex items-center justify-center transition-all duration-300"
              style={{
                background: hover ? "rgba(0,0,0,0.25)" : "rgba(0,0,0,0)",
              }}
            >
              <span
                className="bg-white text-gray-900 text-xs font-medium px-4 py-2 rounded-full shadow-md transition-all duration-300"
                style={{
                  opacity: hover ? 1 : 0,
                  transform: hover ? "translateY(0)" : "translateY(4px)",
                }}
              >
                + Pilih & Beli
              </span>
            </div>
          )}

          {/* Badge stok habis */}
          {stok === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <span className="bg-white text-gray-800 text-xs font-medium px-3 py-1 rounded-full">
                Stok Habis
              </span>
            </div>
          )}

          {/* Badge stok menipis */}
          {stok > 0 && stok <= 5 && (
            <div className="absolute top-2 right-2">
              <span className="bg-yellow-400 text-yellow-900 text-xs font-medium px-2 py-0.5 rounded-full">
                Sisa {stok}
              </span>
            </div>
          )}
        </div>

        {/* Info produk */}
        <div className="p-4">
          <Link href={`/produk/${id}`}>
            <span className="text-xs text-gray-400 uppercase">{kategori}</span>
            <h2 className="font-semibold text-gray-800 mt-1 mb-1 hover:text-black transition line-clamp-2">
              {nama}
            </h2>
          </Link>

          <div className="flex items-center justify-between mt-2">
            <span className="text-green-600 font-bold text-sm">
              Rp{" "}
              {typeof harga === "number"
                ? harga.toLocaleString("id-ID")
                : harga}
            </span>

            {stok > 0 ? (
              <button
                onClick={() => setModalTerbuka(true)}
                className="bg-black text-white text-xs px-3 py-1.5 rounded-full hover:bg-gray-800 transition"
              >
                + Keranjang
              </button>
            ) : (
              <span className="text-xs text-gray-400">Habis</span>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalTerbuka && (
        <ModalProduk produk={produk} onClose={() => setModalTerbuka(false)} />
      )}
    </>
  );
}
