import prisma from "@/lib/prisma";
import TombolHapusOngkir from "@/components/TombolHapusOngkir";
import Link from "next/link";

export default async function AdminOngkirPage() {
  const ongkir = await prisma.ongkirKota.findMany({
    orderBy: { biaya: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">
          Manajemen Ongkir
        </h1>
        <Link
          href="/admin/ongkir/tambah"
          className="bg-black text-white px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm hover:bg-gray-800"
        >
          + Tambah Kota
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[400px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left text-gray-400 font-medium px-4 md:px-6 py-4">
                  Kota
                </th>
                <th className="text-left text-gray-400 font-medium px-4 md:px-6 py-4">
                  Biaya Ongkir
                </th>
                <th className="text-left text-gray-400 font-medium px-4 md:px-6 py-4">
                  Estimasi
                </th>
                <th className="text-left text-gray-400 font-medium px-4 md:px-6 py-4">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {ongkir.map((item) => (
                <tr key={item.id} className="border-t border-gray-100">
                  <td className="px-4 md:px-6 py-4 text-gray-900 font-medium">
                    {item.kota}
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <span
                      className={`text-sm font-medium ${item.biaya === 0 ? "text-green-600" : "text-gray-900"}`}
                    >
                      {item.biaya === 0
                        ? "Gratis"
                        : `Rp ${item.biaya.toLocaleString("id-ID")}`}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-4 text-gray-600">
                    {item.estimasi}
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/ongkir/edit/${item.id}`}
                        className="text-xs border border-gray-200 px-2 md:px-3 py-1.5 rounded-lg hover:bg-gray-50 text-gray-700"
                      >
                        Edit
                      </Link>
                      <TombolHapusOngkir id={item.id} kota={item.kota} />
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
