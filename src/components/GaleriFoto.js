"use client";

import { useState } from "react";

export default function GaleriFoto({ fotos, nama }) {
  const [fotoAktif, setFotoAktif] = useState(0);

  if (fotos.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="w-full aspect-square bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400 text-sm">Foto Produk</span>
        </div>
      </div>
    );
  }

  // Jaga-jaga kalau jumlah foto berubah dan indeks lama di luar batas
  const indeksAman = Math.min(fotoAktif, fotos.length - 1);

  return (
    <div className="flex flex-col gap-3">
      {/* Foto utama — hanya satu yang tampil dalam satu kotak */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="w-full aspect-square flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={fotos[indeksAman]}
            alt={`${nama} foto ${indeksAman + 1}`}
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Thumbnail untuk mengganti foto (kotak kecil) */}
      {fotos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {fotos.map((url, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setFotoAktif(index)}
              aria-label={`Lihat foto ${index + 1}`}
              aria-current={indeksAman === index}
              className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition ${
                indeksAman === index
                  ? "border-black"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
