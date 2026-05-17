import Navbar from "@/components/Navbar";
import TombolKeranjang from "@/components/TombolKeranjang";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function DetailProduk({ params }) {
  const { id } = await params;

  const item = await prisma.produk.findUnique({
    where: { id: parseInt(id) },
    include: {
      fotos: { orderBy: { urutan: "asc" } },
      ukurans: { orderBy: { ukuran: "asc" } },
    },
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

  const semuaFoto =
    item.fotos.length > 0
      ? item.fotos.map((f) => f.url)
      : item.gambar
        ? [item.gambar]
        : [];

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-10">
        {/* Tombol kembali */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-black font-medium mb-6"
        >
          ← Kembali
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Kiri — Galeri foto */}
          <div className="flex flex-col gap-3">
            {/* Foto utama */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              {semuaFoto.length === 0 ? (
                <div className="w-full aspect-square bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">Foto Produk</span>
                </div>
              ) : (
                <div className="flex flex-col">
                  {semuaFoto.map((url, index) => (
                    <div
                      key={index}
                      className={index > 0 ? "border-t border-gray-100" : ""}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt={`${item.nama} foto ${index + 1}`}
                        className="w-full object-contain"
                        style={{ maxHeight: "520px" }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnail kalau lebih dari 1 foto */}
            {semuaFoto.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {semuaFoto.map((url, index) => (
                  <div
                    key={index}
                    className="shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 border-gray-200"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Kanan — Info produk */}
          <div className="flex flex-col gap-5">
            {/* Header */}
            <div>
              <span className="text-xs text-gray-400 uppercase font-medium tracking-wider">
                {item.kategori}
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1 mb-3">
                {item.nama}
              </h1>
              <p className="text-2xl font-bold text-green-600">
                Rp {item.harga.toLocaleString("id-ID")}
              </p>
            </div>

            {/* Badge stok */}
            <div>
              <span
                className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium ${
                  item.stok === 0
                    ? "bg-red-100 text-red-700"
                    : item.stok <= 5
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full inline-block ${
                    item.stok === 0
                      ? "bg-red-500"
                      : item.stok <= 5
                        ? "bg-yellow-500"
                        : "bg-green-500"
                  }`}
                ></span>
                {item.stok === 0
                  ? "Stok habis"
                  : item.stok <= 5
                    ? `Sisa ${item.stok} pcs`
                    : "Stok tersedia"}
              </span>
            </div>

            {/* Deskripsi */}
            {item.deskripsi && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  Deskripsi Produk
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.deskripsi}
                </p>
              </div>
            )}

            {/* Divider */}
            <div className="border-t border-gray-100"></div>

            {/* Pilih ukuran & tombol keranjang */}
            <TombolKeranjang produk={item} />

            {/* Divider */}
            <div className="border-t border-gray-100"></div>

            {/* Info tambahan */}
            <div className="flex flex-col gap-3 bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <span className="text-base">🚚</span>
                <span>Pengiriman ke seluruh Indonesia</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <span className="text-base">✅</span>
                <span>Produk original & berkualitas tinggi</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <span className="text-base">💬</span>
                <span>Konfirmasi pesanan via WhatsApp admin</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <span className="text-base">🔒</span>
                <span>Transaksi aman & terpercaya</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
