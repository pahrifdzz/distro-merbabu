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
        {/* Foto — klik untuk ke halaman detail */}
        <Link href={`/produk/${id}`}>
          <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden relative group">
            {gambar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={gambar}
                alt={nama}
                className="w-full h-full object-contain transition duration-300"
                style={{ transform: "scale(1)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              />
            ) : (
              <span className="text-gray-400 text-sm">Foto Produk</span>
            )}

            {/* Overlay hover */}
            <div
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
              style={{ background: "rgba(0,0,0,0.2)" }}
            >
              <span className="bg-white text-gray-900 text-xs font-medium px-4 py-2 rounded-full shadow-md">
                Lihat Detail
              </span>
            </div>

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
        </Link>

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

      {/* Modal hanya untuk tombol + Keranjang */}
      {modalTerbuka && (
        <ModalProduk produk={produk} onClose={() => setModalTerbuka(false)} />
      )}
    </>
  );
}
