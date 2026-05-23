import prisma from "@/lib/prisma";
import Link from "next/link";
import TombolHapusVoucher from "@/components/TombolHapusVoucher";

export default async function AdminVoucherPage() {
  const vouchers = await prisma.voucher.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            Manajemen Voucher
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola kode diskon untuk pelanggan
          </p>
        </div>
        <Link
          href="/admin/voucher/tambah"
          className="bg-black text-white px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm hover:bg-gray-800"
        >
          + Tambah Voucher
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left text-gray-400 font-medium px-4 md:px-6 py-4">
                  Kode
                </th>
                <th className="text-left text-gray-400 font-medium px-4 md:px-6 py-4">
                  Diskon
                </th>
                <th className="text-left text-gray-400 font-medium px-4 md:px-6 py-4">
                  Min. Belanja
                </th>
                <th className="text-left text-gray-400 font-medium px-4 md:px-6 py-4">
                  Kuota
                </th>
                <th className="text-left text-gray-400 font-medium px-4 md:px-6 py-4">
                  Expired
                </th>
                <th className="text-left text-gray-400 font-medium px-4 md:px-6 py-4">
                  Status
                </th>
                <th className="text-left text-gray-400 font-medium px-4 md:px-6 py-4">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {vouchers.map((v) => {
                const sudahExpired =
                  v.expiredAt && new Date() > new Date(v.expiredAt);
                const kuotaHabis = v.terpakai >= v.kuota;
                return (
                  <tr key={v.id} className="border-t border-gray-100">
                    <td className="px-4 md:px-6 py-4">
                      <span className="font-mono font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded-lg text-xs">
                        {v.kode}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-gray-900">
                      {v.tipe === "persen"
                        ? `${v.diskon}%${v.maxDiskon ? ` (maks Rp ${v.maxDiskon.toLocaleString("id-ID")})` : ""}`
                        : `Rp ${v.diskon.toLocaleString("id-ID")}`}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-gray-600">
                      {v.minBelanja > 0
                        ? `Rp ${v.minBelanja.toLocaleString("id-ID")}`
                        : "-"}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-gray-600">
                      {v.terpakai}/{v.kuota}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-gray-600">
                      {v.expiredAt
                        ? new Date(v.expiredAt).toLocaleDateString("id-ID")
                        : "-"}
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          !v.aktif || sudahExpired || kuotaHabis
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {!v.aktif
                          ? "Nonaktif"
                          : sudahExpired
                            ? "Expired"
                            : kuotaHabis
                              ? "Habis"
                              : "Aktif"}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/voucher/edit/${v.id}`}
                          className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 text-gray-700"
                        >
                          Edit
                        </Link>
                        <TombolHapusVoucher id={v.id} kode={v.kode} />
                      </div>
                    </td>
                  </tr>
                );
              })}

              {vouchers.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-gray-400 text-sm"
                  >
                    Belum ada voucher. Klik "+ Tambah Voucher" untuk membuat
                    voucher baru.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
