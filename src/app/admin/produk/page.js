import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function AdminProdukPage() {
  const produk = await prisma.produk.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manajemen Produk</h1>
        <Link
          href="/admin/produk/tambah"
          className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800"
        >
          + Tambah Produk
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left text-gray-400 font-medium px-6 py-4">
                Nama Produk
              </th>
              <th className="text-left text-gray-400 font-medium px-6 py-4">
                Kategori
              </th>
              <th className="text-left text-gray-400 font-medium px-6 py-4">
                Harga
              </th>
              <th className="text-left text-gray-400 font-medium px-6 py-4">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {produk.map((item) => (
              <tr key={item.id} className="border-t border-gray-100">
                <td className="px-6 py-4 text-gray-900 font-medium">
                  {item.nama}
                </td>
                <td className="px-6 py-4 text-gray-600">{item.kategori}</td>
                <td className="px-6 py-4 text-gray-900">
                  Rp {item.harga.toLocaleString("id-ID")}
                </td>
                <td className="px-6 py-4 flex gap-2">
                  <Link
                    href={`/admin/produk/edit/${item.id}`}
                    className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 text-gray-700"
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/admin/produk/hapus/${item.id}`}
                    className="text-xs border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 text-red-600"
                  >
                    Hapus
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
