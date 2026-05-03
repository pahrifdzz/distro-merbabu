import prisma from "@/lib/prisma";

export default async function AdminPenggunaPage() {
  const pengguna = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { pesanan: true } } },
  });

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
        Manajemen Pengguna
      </h1>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[550px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left text-gray-400 font-medium px-4 md:px-6 py-4">
                  Nama
                </th>
                <th className="text-left text-gray-400 font-medium px-4 md:px-6 py-4">
                  Email
                </th>
                <th className="text-left text-gray-400 font-medium px-4 md:px-6 py-4">
                  Role
                </th>
                <th className="text-left text-gray-400 font-medium px-4 md:px-6 py-4">
                  Pesanan
                </th>
                <th className="text-left text-gray-400 font-medium px-4 md:px-6 py-4">
                  Bergabung
                </th>
              </tr>
            </thead>
            <tbody>
              {pengguna.map((user) => (
                <tr key={user.id} className="border-t border-gray-100">
                  <td className="px-4 md:px-6 py-4 text-gray-900 font-medium">
                    {user.nama}
                  </td>
                  <td className="px-4 md:px-6 py-4 text-gray-600">
                    {user.email}
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-4 text-gray-600">
                    {user._count.pesanan} pesanan
                  </td>
                  <td className="px-4 md:px-6 py-4 text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString("id-ID")}
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
