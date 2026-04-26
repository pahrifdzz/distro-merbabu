import Navbar from "@/components/Navbar";
import TombolKeranjang from "@/components/TombolKeranjang";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function DetailProduk({ params }) {
  const { id } = await params;

  const item = await prisma.produk.findUnique({
    where: { id: parseInt(id) },
  });

  if (!item) {
    return (
      <main>
        <Navbar />
        <div className="max-w-5xl mx-auto px-8 py-10">
          <p className="text-gray-500">Produk tidak ditemukan.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-8 py-10">
        <Link
          href="/"
          className="text-sm text-gray-400 hover:text-black mb-6 inline-block"
        >
          ← Kembali
        </Link>

        <div className="bg-white rounded-xl border border-gray-200 p-8 flex gap-10">
          <div className="w-72 h-72 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
            <span className="text-gray-400 text-sm">Foto Produk</span>
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <span className="text-xs text-gray-400 uppercase">
                {item.kategori}
              </span>
              <h1 className="text-2xl font-bold mt-1 mb-3">{item.nama}</h1>
              <p className="text-gray-500 text-sm leading-relaxed">
                {item.deskripsi}
              </p>
            </div>

            <div>
              <p className="text-2xl font-bold text-green-600 mb-4">
                Rp {item.harga.toLocaleString("id-ID")}
              </p>
              {/* Komponen client khusus untuk tombol keranjang */}
              <TombolKeranjang produk={item} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
