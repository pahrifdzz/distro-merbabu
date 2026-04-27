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

      <div className="max-w-5xl mx-auto px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Koleksi Terbaru
        </h1>
        <p className="text-gray-600 mb-8">
          Pakaian outdoor & streetwear berkualitas tinggi
        </p>

        <div className="grid grid-cols-3 gap-6">
          {produk.map((item) => (
            <KartuProduk
              key={item.id}
              id={item.id}
              nama={item.nama}
              harga={item.harga.toLocaleString("id-ID")}
              kategori={item.kategori}
              gambar={item.gambar}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
