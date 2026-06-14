import prisma from "@/lib/prisma";
import TombolStatusPesanan from "@/components/TombolStatusPesanan";
import TombolHapusPesanan from "@/components/TombolHapusPesanan";
import Link from "next/link";

export default async function AdminPesananPage({ searchParams }) {
  const filter = searchParams?.filter || "semua";

  const whereClause =
    filter === "aktif"
      ? { status: { in: ["pending", "diproses"] } }
      : filter === "selesai"
        ? { status: "selesai" }
        : {};

  const pesanan = await prisma.pesanan.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    include: { user: true, items: true },
  });

  const totalPending = await prisma.pesanan.count({
    where: { status: "pending" },
  });
  const totalDiproses = await prisma.pesanan.count({
    where: { status: "diproses" },
  });
  const totalSelesai = await prisma.pesanan.count({
    where: { status: "selesai" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            Manajemen Pesanan
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Pesanan selesai bisa dihapus dari riwayat
          </p>
        </div>
      </div>

      {/* Filter tab */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        <Link
          href="/admin/pesanan"
          className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition ${
            filter === "semua"
              ? "bg-black text-white border-black"
              : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
          }`}
        >
          Semua ({totalPending + totalDiproses + totalSelesai})
        </Link>
        <Link
          href="/admin/pesanan?filter=aktif"
          className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition ${
            filter === "aktif"
              ? "bg-black text-white border-black"
              : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
          }`}
        >
          Aktif ({totalPending + totalDiproses})
        </Link>
        <Link
          href="/admin/pesanan?filter=selesai"
          className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition ${
            filter === "selesai"
              ? "bg-black text-white border-black"
              : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
          }`}
        >
          Selesai ({totalSelesai})
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left text-gray-400 font-medium px-4 md:px-6 py-4">
                  ID
                </th>
                <th className="text-left text-gray-400 font-medium px-4 md:px-6 py-4">
                  Pelanggan
                </th>
                <th className="text-left text-gray-400 font-medium px-4 md:px-6 py-4">
                  Item
                </th>
                <th className="text-left text-gray-400 font-medium px-4 md:px-6 py-4">
                  Total
                </th>
                <th className="text-left text-gray-400 font-medium px-4 md:px-6 py-4">
                  Bukti
                </th>
                <th className="text-left text-gray-400 font-medium px-4 md:px-6 py-4">
                  Status
                </th>
                <th className="text-left text-gray-400 font-medium px-4 md:px-6 py-4">
                  Tanggal
                </th>
                <th className="text-left text-gray-400 font-medium px-4 md:px-6 py-4">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {pesanan.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-12 text-center text-gray-400 text-sm"
                  >
                    Tidak ada pesanan
                  </td>
                </tr>
              )}
              {pesanan.map((item) => (
                <tr key={item.id} className="border-t border-gray-100">
                  <td className="px-4 md:px-6 py-4 text-gray-900">
                    #{item.id}
                  </td>
                  <td className="px-4 md:px-6 py-4 text-gray-700">
                    {item.user.nama}
                  </td>
                  <td className="px-4 md:px-6 py-4 text-gray-600">
                    {item.items.length} item
                  </td>
                  <td className="px-4 md:px-6 py-4 text-gray-900">
                    Rp {item.total.toLocaleString("id-ID")}
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    {item.buktiPembayaran ? (
                      <a
                        href={item.buktiPembayaran}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 border border-blue-200 px-2 py-1.5 rounded-lg hover:bg-blue-50"
                      >
                        Lihat
                      </a>
                    ) : (
                      <span className="text-xs text-gray-300">-</span>
                    )}
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        item.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : item.status === "diproses"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-4 text-gray-400">
                    {new Date(item.createdAt).toLocaleDateString("id-ID")}
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <div className="flex gap-2">
                      <TombolStatusPesanan
                        id={item.id}
                        statusSaat={item.status}
                      />
                      <TombolHapusPesanan id={item.id} status={item.status} />
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
