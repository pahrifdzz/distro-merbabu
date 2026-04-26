import Link from "next/link";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-200 shrink-0 flex flex-col">
        <div className="px-6 py-5 border-b border-gray-200">
          <p className="font-bold text-gray-900">Distro Merbabu</p>
          <p className="text-xs text-gray-400 mt-0.5">Dashboard Admin</p>
        </div>

        <nav className="flex flex-col gap-1 p-4 flex-1">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          >
            📊 Overview
          </Link>
          <Link
            href="/admin/produk"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          >
            🛍️ Produk
          </Link>
          <Link
            href="/admin/pesanan"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          >
            📦 Pesanan
          </Link>
          <Link
            href="/admin/pengguna"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          >
            👥 Pengguna
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
          >
            ← Kembali ke Toko
          </Link>
        </div>
      </aside>

      {/* Konten utama */}
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
