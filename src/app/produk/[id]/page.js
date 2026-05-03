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
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-10">
          <p className="text-gray-500">Produk tidak ditemukan.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-10">
        {/* Tombol kembali — diperjelas */}
        <Link
          href="/"
          className="text-sm text-gray-700 hover:text-black mb-6 inline-flex items-center gap-1 font-medium"
        >
          ← Kembali
        </Link>

        <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-8 flex flex-col md:flex-row gap-6 md:gap-10">
          {/* Gambar */}
          <div className="w-full md:w-72 h-56 md:h-72 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center shrink-0">
            {item.gambar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.gambar}
                alt={item.nama}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-400 text-sm">Foto Produk</span>
            )}
          </div>

          <div className="flex flex-col justify-between gap-4">
            <div>
              {/* Kategori */}
              <span className="text-xs text-gray-500 uppercase font-medium tracking-wider">
                {item.kategori}
              </span>

              {/* Nama produk — diperjelas */}
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 mt-1 mb-3">
                {item.nama}
              </h1>

              {/* Deskripsi */}
              <p className="text-gray-600 text-sm leading-relaxed">
                {item.deskripsi}
              </p>
            </div>

            <div>
              <p className="text-xl md:text-2xl font-bold text-green-600 mb-4">
                Rp {item.harga.toLocaleString("id-ID")}
              </p>
              <TombolKeranjang produk={item} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
