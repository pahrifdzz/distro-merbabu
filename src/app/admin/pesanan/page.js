import prisma from '@/lib/prisma'
import TombolStatusPesanan from '@/components/TombolStatusPesanan'

export default async function AdminPesananPage() {
  const pesanan = await prisma.pesanan.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: true, items: true }
  })

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Manajemen Pesanan</h1>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left text-gray-400 font-medium px-4 md:px-6 py-4">ID</th>
                <th className="text-left text-gray-400 font-medium px-4 md:px-6 py-4">Pelanggan</th>
                <th className="text-left text-gray-400 font-medium px-4 md:px-6 py-4">Item</th>
                <th className="text-left text-gray-400 font-medium px-4 md:px-6 py-4">Total</th>
                <th className="text-left text-gray-400 font-medium px-4 md:px-6 py-4">Bukti</th>
                <th className="text-left text-gray-400 font-medium px-4 md:px-6 py-4">Status</th>
                <th className="text-left text-gray-400 font-medium px-4 md:px-6 py-4">Tanggal</th>
                <th className="text-left text-gray-400 font-medium px-4 md:px-6 py-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pesanan.map((item) => (
                <tr key={item.id} className="border-t border-gray-100">
                  <td className="px-4 md:px-6 py-4 text-gray-900">#{item.id}</td>
                  <td className="px-4 md:px-6 py-4 text-gray-700">{item.user.nama}</td>
                  <td className="px-4 md:px-6 py-4 text-gray-600">{item.items.length} item</td>
                  <td className="px-4 md:px-6 py-4 text-gray-900">Rp {item.total.toLocaleString('id-ID')}</td>
                  <td className="px-4 md:px-6 py-4">
                    {item.buktiPembayaran ? (
                      
                        href={item.buktiPembayaran}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 border border-blue-200 px-2 py-1.5 rounded-lg hover:bg-blue-50"
                      >
                        Lihat Bukti
                      </a>
                    ) : (
                      <span className="text-xs text-gray-300">Belum ada</span>
                    )}
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      item.status === 'pending' ? 'bg-yellow-100 text-yellow-700'
                      : item.status === 'diproses' ? 'bg-blue-100 text-blue-700'
                      : 'bg-green-100 text-green-700'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-4 text-gray-400">
                    {new Date(item.createdAt).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <TombolStatusPesanan id={item.id} statusSaat={item.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}