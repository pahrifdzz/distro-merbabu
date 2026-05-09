import Navbar from "@/components/Navbar";
import KartuProduk from "@/components/KartuProduk";
import prisma from "@/lib/prisma";

export default async function Home() {
  const produk = await prisma.produk.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-10">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Koleksi Terbaru
        </h1>
        <p className="text-gray-600 mb-6 md:mb-8 text-sm md:text-base">
          Pakaian outdoor & streetwear berkualitas tinggi
        </p>

        {/* Grid responsif — 1 kolom di mobile, 2 di tablet, 3 di desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {produk.map((item) => (
            <KartuProduk
              key={item.id}
              id={item.id}
              nama={item.nama}
              harga={item.harga.toLocaleString("id-ID")}
              kategori={item.kategori}
              gambar={item.gambar}
              stok={item.stok}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
