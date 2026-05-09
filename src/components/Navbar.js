"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useKeranjang } from "@/context/KeranjangContext";

export default function Navbar() {
  const { data: session } = useSession();
  const { totalItem } = useKeranjang();
  const [menuTerbuka, setMenuTerbuka] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/merbabu.png"
            alt="Distro Merbabu"
            className="h-10 w-auto"
          />
        </Link>

        {/* Menu desktop */}
        <div className="hidden md:flex gap-6 text-gray-600 text-sm">
          <Link href="/" className="hover:text-black">
            Produk
          </Link>
          <Link href="/tentang" className="hover:text-black">
            Tentang
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
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

        {/* Tombol hamburger mobile */}
        <div className="flex md:hidden items-center gap-3">
          <Link href="/keranjang" className="relative">
            <div className="w-9 h-9 border border-gray-200 rounded-full flex items-center justify-center">
              🛒
            </div>
            {totalItem > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                {totalItem}
              </span>
            )}
          </Link>
          <button
            onClick={() => setMenuTerbuka(!menuTerbuka)}
            className="w-9 h-9 border border-gray-200 rounded-full flex items-center justify-center text-gray-600"
          >
            {menuTerbuka ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Menu mobile dropdown */}
      {menuTerbuka && (
        <div className="md:hidden border-t border-gray-100 mt-4 pt-4 flex flex-col gap-3 px-2">
          <Link
            href="/"
            className="text-sm text-gray-700 py-2 hover:text-black"
            onClick={() => setMenuTerbuka(false)}
          >
            Produk
          </Link>
          <Link
            href="/tentang"
            className="text-sm text-gray-700 py-2 hover:text-black"
            onClick={() => setMenuTerbuka(false)}
          >
            Tentang
          </Link>
          {session ? (
            <>
              <Link
                href="/profil"
                className="text-sm text-gray-700 py-2 hover:text-black"
                onClick={() => setMenuTerbuka(false)}
              >
                👤 {session.user.nama}
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="text-sm text-left text-red-500 py-2"
              >
                Keluar
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-gray-700 py-2 hover:text-black"
                onClick={() => setMenuTerbuka(false)}
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="text-sm bg-black text-white px-4 py-2 rounded-full text-center"
                onClick={() => setMenuTerbuka(false)}
              >
                Daftar
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
