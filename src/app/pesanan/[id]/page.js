import Navbar from "@/components/Navbar";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function KonfirmasiPesanan({ params }) {
  const { id } = await params;

  const pesanan = await prisma.pesanan.findUnique({
    where: { id: parseInt(id) },
    include: {
      items: true,
      user: true,
    },
  });

  if (!pesanan) {
    return (
      <main>
        <Navbar />
        <div className="max-w-5xl mx-auto px-8 py-10">
          <p>Pesanan tidak ditemukan.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-8 py-16 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold mb-2">Pesanan Berhasil Dibuat!</h1>
        <p className="text-gray-500 text-sm mb-8">
          Terima kasih sudah berbelanja di Distro Merbabu
        </p>

        <div className="bg-white rounded-xl border border-gray-200 p-6 text-left mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold">Detail Pesanan</h2>
            <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-medium">
              {pesanan.status}
            </span>
          </div>

          <div className="text-sm text-gray-500 mb-4">
            <p>
              ID Pesanan:{" "}
              <span className="font-medium text-gray-800">#{pesanan.id}</span>
            </p>
            <p>
              Nama:{" "}
              <span className="font-medium text-gray-800">
                {pesanan.namaPenerima}
              </span>
            </p>
            <p>
              Alamat:{" "}
              <span className="font-medium text-gray-800">
                {pesanan.alamat}
              </span>
            </p>
            <p>
              Telepon:{" "}
              <span className="font-medium text-gray-800">
                {pesanan.telepon}
              </span>
            </p>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <p className="text-sm font-medium mb-3">Item Pesanan:</p>
            {pesanan.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between text-sm text-gray-600 mb-1"
              >
                <span>
                  Produk #{item.produkId} x{item.jumlah}
                </span>
                <span>
                  Rp {(item.harga * item.jumlah).toLocaleString("id-ID")}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-4 mt-4 flex justify-between font-bold">
            <span>Total</span>
            <span>Rp {pesanan.total.toLocaleString("id-ID")}</span>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-left mb-8">
          <p className="text-sm font-medium text-blue-800 mb-1">
            📋 Instruksi Pembayaran
          </p>
          <p className="text-sm text-blue-600">
            Silakan transfer ke rekening BCA <strong>1234567890</strong> a/n
            Distro Merbabu sejumlah{" "}
            <strong>Rp {pesanan.total.toLocaleString("id-ID")}</strong>.
            Konfirmasi pembayaran via WhatsApp ke <strong>08123456789</strong>.
          </p>
        </div>

        <Link
          href="/"
          className="bg-black text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition"
        >
          Kembali Belanja
        </Link>
      </div>
    </main>
  );
}
