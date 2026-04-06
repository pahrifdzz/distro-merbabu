import Link from "next/link";

export default function KartuProduk({ id, nama, harga, kategori }) {
  return (
    <Link href={`/produk/${id}`}>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition cursor-pointer">
        {/* Area gambar produk */}
        <div className="h-48 bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400 text-sm">Foto Produk</span>
        </div>

        {/* Info produk */}
        <div className="p-4">
          <span className="text-xs text-gray-400 uppercase">{kategori}</span>
          <h2 className="font-semibold text-gray-800 mt-1 mb-2">{nama}</h2>
          <div className="flex items-center justify-between">
            <span className="text-green-600 font-semibold">Rp {harga}</span>
            <span className="bg-black text-white text-sm px-4 py-1.5 rounded-full">
              + Keranjang
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
