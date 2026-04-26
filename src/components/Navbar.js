"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useKeranjang } from "@/context/KeranjangContext";

export default function Navbar() {
  const { data: session } = useSession();
  const { totalItem } = useKeranjang();

  return (
    <nav className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
      <Link href="/" className="text-xl font-bold text-gray-900">
        Distro Merbabu
      </Link>

      <div className="flex gap-6 text-gray-600 text-sm">
        <Link href="/" className="hover:text-black">
          Produk
        </Link>
        <Link href="/tentang" className="hover:text-black">
          Tentang
        </Link>
      </div>

      <div className="flex items-center gap-3">
        {/* Ikon keranjang */}
        <Link href="/keranjang" className="relative">
          <div className="w-9 h-9 border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50">
            🛒
          </div>
          {totalItem > 0 && (
            <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
              {totalItem}
            </span>
          )}
        </Link>

        {session ? (
          <>
            {/* Link ke halaman profil */}
            <Link
              href="/profil"
              className="flex items-center gap-2 text-sm text-gray-700 border border-gray-200 px-3 py-1.5 rounded-full hover:bg-gray-50"
            >
              👤 {session.user.nama}
            </Link>

            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-sm border border-gray-200 px-4 py-1.5 rounded-full hover:bg-gray-50 text-gray-700"
            >
              Keluar
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="text-sm text-gray-600 hover:text-black"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="text-sm bg-black text-white px-4 py-1.5 rounded-full hover:bg-gray-800"
            >
              Daftar
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
