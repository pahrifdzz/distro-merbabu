import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function AdminProdukPage() {
  const produk = await prisma.produk.findMany({
    orderBy: { createdAt: "desc" },
  });

  const stokHabis = produk.filter((p) => p.stok === 0).length;
  const stokMenipis = produk.filter((p) => p.stok > 0 && p.stok <= 5).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">
          Manajemen Produk
        </h1>
        <Link
          href="/admin/produk/tambah"
          className="bg-black text-white px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm hover:bg-gray-800"
        >
          + Tambah
        </Link>
      </div>

      {/* Notifikasi stok */}
      {(stokHabis > 0 || stokMenipis > 0) && (
        <div className="flex flex-col gap-2 mb-6">
          {stokHabis > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
              <span className="text-red-500 text-sm">⚠️</span>
              <p className="text-sm text-red-700">
                <strong>{stokHabis} produk</strong> stoknya habis — segera
                update stok!
              </p>
            </div>
          )}
          {stokMenipis > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center gap-2">
              <span className="text-yellow-500 text-sm">⚡</span>
              <p className="text-sm text-yellow-700">
                <strong>{stokMenipis} produk</strong> stoknya menipis (≤5) —
                perlu restock segera!
              </p>
            </div>
          )}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[550px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left text-gray-400 font-medium px-4 md:px-6 py-4">
                  Nama Produk
                </th>
                <th className="text-left text-gray-400 font-medium px-4 md:px-6 py-4">
                  Kategori
                </th>
                <th className="text-left text-gray-400 font-medium px-4 md:px-6 py-4">
                  Harga
                </th>
                <th className="text-left text-gray-400 font-medium px-4 md:px-6 py-4">
                  Stok
                </th>
                <th className="text-left text-gray-400 font-medium px-4 md:px-6 py-4">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {produk.map((item) => (
                <tr key={item.id} className="border-t border-gray-100">
                  <td className="px-4 md:px-6 py-4 text-gray-900 font-medium">
                    {item.nama}
                  </td>
                  <td className="px-4 md:px-6 py-4 text-gray-600">
                    {item.kategori}
                  </td>
                  <td className="px-4 md:px-6 py-4 text-gray-900">
                    Rp {item.harga.toLocaleString("id-ID")}
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        item.stok === 0
                          ? "bg-red-100 text-red-700"
                          : item.stok <= 5
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                      }`}
                    >
                      {item.stok === 0 ? "Habis" : `${item.stok} pcs`}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/produk/edit/${item.id}`}
                        className="text-xs border border-gray-200 px-2 md:px-3 py-1.5 rounded-lg hover:bg-gray-50 text-gray-700"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/admin/produk/hapus/${item.id}`}
                        className="text-xs border border-red-200 px-2 md:px-3 py-1.5 rounded-lg hover:bg-red-50 text-red-600"
                      >
                        Hapus
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
