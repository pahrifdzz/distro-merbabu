import prisma from "@/lib/prisma";

export default async function AdminPage() {
  const totalProduk = await prisma.produk.count();
  const totalPesanan = await prisma.pesanan.count();
  const totalPengguna = await prisma.user.count();
  const pesananTerbaru = await prisma.pesanan.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { user: true },
  });
  const totalPendapatan = await prisma.pesanan.aggregate({
    _sum: { total: true },
  });

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
        Overview
      </h1>

      {/* Kartu statistik — 2 kolom di mobile, 4 di desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-5">
          <p className="text-xs text-gray-400 uppercase mb-1">Total Produk</p>
          <p className="text-2xl md:text-3xl font-bold text-gray-900">
            {totalProduk}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-5">
          <p className="text-xs text-gray-400 uppercase mb-1">Total Pesanan</p>
          <p className="text-2xl md:text-3xl font-bold text-gray-900">
            {totalPesanan}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-5">
          <p className="text-xs text-gray-400 uppercase mb-1">Total Pengguna</p>
          <p className="text-2xl md:text-3xl font-bold text-gray-900">
            {totalPengguna}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-5">
          <p className="text-xs text-gray-400 uppercase mb-1">
            Total Pendapatan
          </p>
          <p className="text-xl md:text-2xl font-bold text-gray-900">
            Rp {(totalPendapatan._sum.total || 0).toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      {/* Tabel pesanan terbaru — scroll horizontal di mobile */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
        <h2 className="font-bold text-gray-900 mb-4">Pesanan Terbaru</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[500px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-gray-400 font-medium pb-3">ID</th>
                <th className="text-left text-gray-400 font-medium pb-3">
                  Pelanggan
                </th>
                <th className="text-left text-gray-400 font-medium pb-3">
                  Total
                </th>
                <th className="text-left text-gray-400 font-medium pb-3">
                  Status
                </th>
                <th className="text-left text-gray-400 font-medium pb-3">
                  Tanggal
                </th>
              </tr>
            </thead>
            <tbody>
              {pesananTerbaru.map((pesanan) => (
                <tr key={pesanan.id} className="border-b border-gray-50">
                  <td className="py-3 text-gray-900">#{pesanan.id}</td>
                  <td className="py-3 text-gray-700">{pesanan.user.nama}</td>
                  <td className="py-3 text-gray-900">
                    Rp {pesanan.total.toLocaleString("id-ID")}
                  </td>
                  <td className="py-3">
                    <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">
                      {pesanan.status}
                    </span>
                  </td>
                  <td className="py-3 text-gray-400">
                    {new Date(pesanan.createdAt).toLocaleDateString("id-ID")}
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
