"use client";

import { useState } from "react";

export default function GaleriFoto({ fotos, nama }) {
  const [fotoAktif, setFotoAktif] = useState(0);

  if (fotos.length === 0) {
    return (
      <div className="w-full md:w-64 h-56 md:h-64 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
        <span className="text-gray-400 text-sm">Foto Produk</span>
      </div>
    );
  }

  return (
    <div className="w-full md:w-64 shrink-0">
      {/* Foto utama */}
      <div className="w-full h-56 md:h-64 bg-gray-100 rounded-xl overflow-hidden mb-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={fotos[fotoAktif]}
          alt={`${nama} foto ${fotoAktif + 1}`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnail kalau lebih dari 1 foto */}
      {fotos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {fotos.map((url, index) => (
            <button
              key={index}
              onClick={() => setFotoAktif(index)}
              className={`shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition ${
                fotoAktif === index
                  ? "border-black"
                  : "border-transparent hover:border-gray-300"
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
