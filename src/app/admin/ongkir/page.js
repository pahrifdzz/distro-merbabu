import prisma from "@/lib/prisma";
import Link from "next/link";
import TombolHapusZona from "@/components/TombolHapusZona";

export default async function AdminOngkirPage() {
  const zona = await prisma.zonaOngkir.findMany({
    orderBy: { biaya: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            Zona Ongkir
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola biaya pengiriman berdasarkan zona wilayah
          </p>
        </div>
        <Link
          href="/admin/ongkir/tambah"
          className="bg-black text-white px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm hover:bg-gray-800"
        >
          + Tambah Zona
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        {zona.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-gray-200 p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-bold text-gray-900 text-sm">
                    {item.namaZona}
                  </h2>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      item.biaya === 0
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {item.biaya === 0
                      ? "Gratis"
                      : `Rp ${item.biaya.toLocaleString("id-ID")}`}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-1">📍 {item.wilayah}</p>
                <p className="text-xs text-gray-400">
                  ⏱️ Estimasi: {item.estimasi}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Link
                  href={`/admin/ongkir/edit/${item.id}`}
                  className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 text-gray-700"
                >
                  Edit
                </Link>
                <TombolHapusZona id={item.id} namaZona={item.namaZona} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
