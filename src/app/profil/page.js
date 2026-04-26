"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function ProfilPage() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) {
    router.push("/login");
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-md mx-auto px-8 py-16">
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          {/* Avatar */}
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">👤</span>
          </div>

          {/* Info user */}
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-gray-900">
              {session.user.nama}
            </h1>
            <p className="text-gray-500 text-sm mt-1">{session.user.email}</p>
            <span
              className={`text-xs px-3 py-1 rounded-full font-medium mt-2 inline-block ${
                session.user.role === "admin"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {session.user.role}
            </span>
          </div>

          {/* Menu */}
          <div className="flex flex-col gap-2 mb-6">
            <button
              onClick={() => router.push("/")}
              className="w-full text-left px-4 py-3 rounded-lg text-sm text-gray-700 hover:bg-gray-50 border border-gray-100"
            >
              🏠 Kembali ke Toko
            </button>

            {session.user.role === "admin" && (
              <button
                onClick={() => router.push("/admin")}
                className="w-full text-left px-4 py-3 rounded-lg text-sm text-gray-700 hover:bg-gray-50 border border-gray-100"
              >
                📊 Dashboard Admin
              </button>
            )}

            <button
              onClick={() => router.push("/keranjang")}
              className="w-full text-left px-4 py-3 rounded-lg text-sm text-gray-700 hover:bg-gray-50 border border-gray-100"
            >
              🛒 Keranjang Belanja
            </button>
          </div>

          {/* Tombol logout */}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full bg-red-500 text-white py-3 rounded-lg text-sm font-medium hover:bg-red-600 transition"
          >
            Keluar dari Akun
          </button>
        </div>
      </div>
    </main>
  );
}
