"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";

export default function ProfilPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [jumlahPesanan, setJumlahPesanan] = useState(0);
  const [profil, setProfil] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ nama: "", telepon: "", alamat: "" });
  const [loading, setLoading] = useState(false);
  const [sukses, setSukses] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session && session.user.role !== "admin") {
      fetch("/api/pesanan/user")
        .then((res) => res.json())
        .then((data) =>
          setJumlahPesanan(Array.isArray(data) ? data.length : 0),
        );

      fetch("/api/profil")
        .then((res) => res.json())
        .then((data) => {
          setProfil(data);
          setForm({
            nama: data.nama || "",
            telepon: data.telepon || "",
            alamat: data.alamat || "",
          });
        });
    }
  }, [session]);

  const handleSimpan = async () => {
    setLoading(true);
    setError("");
    setSukses(false);

    const res = await fetch("/api/profil", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    console.log("Status:", res.status);
    console.log("Content-Type:", res.headers.get("content-type"));

    const text = await res.text();
    console.log("Response text:", text);

    if (!text) {
      setError("Server mengembalikan response kosong");
      setLoading(false);
      return;
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      setError("Response tidak valid: " + text);
      setLoading(false);
      return;
    }

    if (!res.ok) {
      setError(data.error || "Gagal menyimpan profil");
      setLoading(false);
      return;
    }

    setProfil(data);
    setSukses(true);
    setEditMode(false);
    setLoading(false);
    setTimeout(() => setSukses(false), 3000);
  };

  if (status === "loading" || !session) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-400 text-sm">Memuat...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-lg mx-auto px-4 md:px-8 py-10 md:py-14">
        {/* Header profil */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
              <span className="text-2xl">👤</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                {session.user.nama}
              </h1>
              <p className="text-gray-500 text-sm">{session.user.email}</p>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block ${
                  session.user.role === "admin"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {session.user.role}
              </span>
            </div>
          </div>

          {/* Data pengiriman — hanya untuk user biasa */}
          {session.user.role !== "admin" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-gray-900">
                  Data Pengiriman
                </h2>
                {!editMode && (
                  <button
                    onClick={() => setEditMode(true)}
                    className="text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50"
                  >
                    ✏️ Edit
                  </button>
                )}
              </div>

              {/* Notifikasi sukses */}
              {sukses && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-green-700 font-medium">
                    ✅ Profil berhasil disimpan!
                  </p>
                </div>
              )}

              {/* Notifikasi error */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {editMode ? (
                /* Mode edit */
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-black"
                      value={form.nama}
                      onChange={(e) =>
                        setForm({ ...form, nama: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      disabled
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-400 bg-gray-50 cursor-not-allowed"
                      value={session.user.email}
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Email tidak bisa diubah
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">
                      Nomor Telepon
                    </label>
                    <input
                      type="tel"
                      placeholder="Contoh: 08123456789"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-black"
                      value={form.telepon}
                      onChange={(e) =>
                        setForm({ ...form, telepon: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">
                      Alamat Lengkap
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Contoh: Jl. Merbabu No. 1, Tangerang, Banten"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-black resize-none"
                      value={form.alamat}
                      onChange={(e) =>
                        setForm({ ...form, alamat: e.target.value })
                      }
                    />
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={handleSimpan}
                      disabled={loading}
                      className="flex-1 bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
                    >
                      {loading ? "Menyimpan..." : "Simpan"}
                    </button>
                    <button
                      onClick={() => {
                        setEditMode(false);
                        setError("");
                        setForm({
                          nama: profil?.nama || "",
                          telepon: profil?.telepon || "",
                          alamat: profil?.alamat || "",
                        });
                      }}
                      className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-lg text-sm hover:bg-gray-50"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              ) : (
                /* Mode tampil */
                <div className="flex flex-col gap-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Nama Lengkap</p>
                    <p className="text-sm font-medium text-gray-900">
                      {profil?.nama || "-"}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Email</p>
                    <p className="text-sm font-medium text-gray-900">
                      {session.user.email}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Nomor Telepon</p>
                    <p className="text-sm font-medium text-gray-900">
                      {profil?.telepon || (
                        <span className="text-gray-400 italic">
                          Belum diisi
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Alamat Lengkap</p>
                    <p className="text-sm font-medium text-gray-900">
                      {profil?.alamat || (
                        <span className="text-gray-400 italic">
                          Belum diisi
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Peringatan kalau data belum lengkap */}
                  {(!profil?.telepon || !profil?.alamat) && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-xs text-yellow-700">
                        ⚡ Lengkapi data pengiriman agar checkout lebih cepat!
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Menu navigasi */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
          <div className="flex flex-col gap-2">
            <button
              onClick={() => router.push("/")}
              className="w-full text-left px-4 py-3 rounded-lg text-sm text-gray-700 hover:bg-gray-50 border border-gray-100 flex items-center justify-between"
            >
              <span>🏠 Kembali ke Toko</span>
            </button>

            {session.user.role !== "admin" && (
              <button
                onClick={() => router.push("/pesanan")}
                className="w-full text-left px-4 py-3 rounded-lg text-sm text-gray-700 hover:bg-gray-50 border border-gray-100 flex items-center justify-between"
              >
                <span>📦 Pesanan Saya</span>
                {jumlahPesanan > 0 && (
                  <span className="bg-black text-white text-xs px-2 py-0.5 rounded-full">
                    {jumlahPesanan}
                  </span>
                )}
              </button>
            )}

            {session.user.role !== "admin" && (
              <button
                onClick={() => router.push("/keranjang")}
                className="w-full text-left px-4 py-3 rounded-lg text-sm text-gray-700 hover:bg-gray-50 border border-gray-100"
              >
                🛒 Keranjang Belanja
              </button>
            )}

            {session.user.role === "admin" && (
              <button
                onClick={() => router.push("/admin")}
                className="w-full text-left px-4 py-3 rounded-lg text-sm text-gray-700 hover:bg-gray-50 border border-gray-100"
              >
                📊 Dashboard Admin
              </button>
            )}
          </div>
        </div>

        {/* Tombol logout */}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full bg-red-500 text-white py-3 rounded-xl text-sm font-medium hover:bg-red-600 transition"
        >
          Keluar dari Akun
        </button>
      </div>
    </main>
  );
}
