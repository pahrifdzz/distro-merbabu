import Link from "next/link";
import TombolJumlah from "@/components/TombolJumlah";

export default function KartuProduk({
  id,
  nama,
  harga,
  kategori,
  gambar,
  stok,
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition">
      {/* Foto produk — bisa diklik ke detail */}
      <Link href={`/produk/${id}`}>
        <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden relative">
          {gambar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={gambar}
              alt={nama}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-400 text-sm">Foto Produk</span>
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
      </Link>

      {/* Info produk */}
      <div className="p-4">
        <Link href={`/produk/${id}`}>
          <span className="text-xs text-gray-400 uppercase">{kategori}</span>
          <h2 className="font-semibold text-gray-800 mt-1 mb-2 hover:text-black transition">
            {nama}
          </h2>
          <span className="text-green-600 font-semibold text-sm">
            Rp {harga}
          </span>
        </Link>

        {/* Tombol jumlah + keranjang */}
        <TombolJumlah
          produk={{
            id,
            nama,
            harga: parseInt(harga.replace(/\./g, "")),
            kategori,
            gambar,
            stok,
          }}
        />
      </div>
    </div>
  );
}
