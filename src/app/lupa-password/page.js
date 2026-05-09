"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LupaPasswordPage() {
  const router = useRouter();
  const [tahap, setTahap] = useState(1); // 1: email, 2: kode & password baru
  const [email, setEmail] = useState("");
  const [kode, setKode] = useState("");
  const [passwordBaru, setPasswordBaru] = useState("");
  const [konfirmasiPassword, setKonfirmasiPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pesan, setPesan] = useState("");

  const handleKirimKode = async () => {
    if (!email) {
      setError("Email wajib diisi");
      return;
    }

    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/lupa-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error);
      return;
    }

    setPesan(data.message);
    setTahap(2);
  };

  const handleResetPassword = async () => {
    if (!kode || !passwordBaru || !konfirmasiPassword) {
      setError("Semua field wajib diisi");
      return;
    }

    if (passwordBaru !== konfirmasiPassword) {
      setError("Konfirmasi password tidak cocok");
      return;
    }

    if (passwordBaru.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, kode, passwordBaru }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error);
      return;
    }

    setTahap(3);
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl border border-gray-200 p-8 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/merbabu.png"
            alt="Distro Merbabu"
            className="h-14 w-auto"
          />
        </div>

        {/* Tahap 1 — Input email */}
        {tahap === 1 && (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
              Lupa Password
            </h1>
            <p className="text-gray-600 text-sm mb-6 text-center">
              Masukkan email yang terdaftar dan kami akan mengirimkan kode
              verifikasi
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3 mb-4">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-gray-800 block mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Masukkan email terdaftar"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-black"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button
                onClick={handleKirimKode}
                disabled={loading}
                className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50"
              >
                {loading ? "Mengirim kode..." : "Kirim Kode Verifikasi"}
              </button>
            </div>
          </>
        )}

        {/* Tahap 2 — Input kode & password baru */}
        {tahap === 2 && (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
              Cek Email Kamu
            </h1>

            {pesan && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-green-700 text-center">{pesan}</p>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
              <p className="text-xs text-blue-700 text-center">
                Kode dikirim ke <strong>{email}</strong>.<br />
                Kode berlaku selama <strong>15 menit</strong>.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3 mb-4">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-gray-800 block mb-1">
                  Kode Verifikasi
                </label>
                <input
                  type="text"
                  placeholder="Masukkan 6 digit kode"
                  maxLength={6}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-black text-center tracking-widest text-lg font-bold"
                  value={kode}
                  onChange={(e) => setKode(e.target.value.replace(/\D/g, ""))}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-800 block mb-1">
                  Password Baru
                </label>
                <input
                  type="password"
                  placeholder="Minimal 6 karakter"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-black"
                  value={passwordBaru}
                  onChange={(e) => setPasswordBaru(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-800 block mb-1">
                  Konfirmasi Password Baru
                </label>
                <input
                  type="password"
                  placeholder="Ulangi password baru"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-black"
                  value={konfirmasiPassword}
                  onChange={(e) => setKonfirmasiPassword(e.target.value)}
                />
              </div>

              <button
                onClick={handleResetPassword}
                disabled={loading}
                className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50"
              >
                {loading ? "Memproses..." : "Reset Password"}
              </button>

              <button
                onClick={() => {
                  setTahap(1);
                  setError("");
                  setPesan("");
                }}
                className="w-full text-sm text-gray-500 hover:text-black"
              >
                ← Ganti email
              </button>
            </div>
          </>
        )}

        {/* Tahap 3 — Sukses */}
        {tahap === 3 && (
          <div className="text-center">
            <div className="text-5xl mb-4">✅</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Password Berhasil Direset!
            </h1>
            <p className="text-gray-600 text-sm mb-6">
              Password kamu sudah diperbarui. Silakan login dengan password baru
              kamu.
            </p>
            <button
              onClick={() => router.push("/login")}
              className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
            >
              Login Sekarang
            </button>
          </div>
        )}

        {/* Link kembali ke login */}
        {tahap !== 3 && (
          <p className="text-center text-sm text-gray-500 mt-6">
            Ingat password?{" "}
            <Link
              href="/login"
              className="text-black font-medium hover:underline"
            >
              Masuk di sini
            </Link>
          </p>
        )}
      </div>
    </main>
  );
}
