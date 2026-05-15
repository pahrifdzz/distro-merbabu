"use client";

import Link from "next/link";
import { useState } from "react";

export default function AdminLayout({ children }) {
  const [sidebarTerbuka, setSidebarTerbuka] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {sidebarTerbuka && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-20 md:hidden"
          onClick={() => setSidebarTerbuka(false)}
        />
      )}

      <aside
        className={`
        fixed md:static inset-y-0 left-0 z-30
        w-56 bg-white border-r border-gray-200 flex flex-col
        transform transition-transform duration-200
        ${sidebarTerbuka ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}
      >
        {/* Logo di sidebar */}
        <div className="px-6 py-4 border-b border-gray-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/merbabu.png"
            alt="Distro Merbabu"
            className="h-8 w-auto mb-1"
          />
          <p className="text-xs text-gray-400">Dashboard Admin</p>
        </div>

        <nav className="flex flex-col gap-1 p-4 flex-1">
          <Link
            href="/admin"
            onClick={() => setSidebarTerbuka(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          >
            📊 Overview
          </Link>
          <Link
            href="/admin/produk"
            onClick={() => setSidebarTerbuka(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          >
            🛍️ Produk
          </Link>
          <Link
            href="/admin/pesanan"
            onClick={() => setSidebarTerbuka(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          >
            📦 Pesanan
          </Link>
          <Link
            href="/admin/pengguna"
            onClick={() => setSidebarTerbuka(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          >
            👥 Pengguna
          </Link>
          <Link
            href="/admin/ongkir"
            onClick={() => setSidebarTerbuka(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          >
            🚚 Zona Ongkir
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

      <div className="flex-1 flex flex-col min-w-0">
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarTerbuka(true)}
            className="w-9 h-9 border border-gray-200 rounded-lg flex items-center justify-center text-gray-600"
          >
            ☰
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/merbabu.png" alt="Distro Merbabu" className="h-7 w-auto" />
        </div>

        <main className="flex-1 p-4 md:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
