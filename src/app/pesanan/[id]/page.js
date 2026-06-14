"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function KonfirmasiPesanan() {
  const { id } = useParams();
  const [pesanan, setPesanan] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [tersalin, setTersalin] = useState(false);

  const fetchPesanan = useCallback(async () => {
    const res = await fetch(`/api/pesanan/${id}`);
    const data = await res.json();
    setPesanan(data);

    if (data.paymentNumber) {
      setPaymentData({
        payment_number: data.paymentNumber,
        expired_at: data.paymentExpiredAt,
      });
    }
  }, [id]);

  useEffect(() => {
    fetchPesanan();
  }, [fetchPesanan]);

  const handleBuatPembayaran = async () => {
    console.log("handleBuatPembayaran dipanggil");
    setLoadingPayment(true);

    try {
      const res = await fetch("/api/pakasir/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pesananId: id }),
      });

      console.log("Response status:", res.status);
      const data = await res.json();
      console.log("Response data:", data);

      setLoadingPayment(false);

      if (!res.ok) {
        alert(data.error || "Gagal membuat pembayaran");
        return;
      }

      console.log("Payment data:", data.payment);
      setPaymentData(data.payment);
      fetchPesanan();
    } catch (error) {
      console.error("Error:", error);
      setLoadingPayment(false);
      alert("Terjadi kesalahan: " + error.message);
    }
  };

  const cekStatusPembayaran = async () => {
    setLoadingStatus(true);

    const res = await fetch("/api/pakasir/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pesananId: id }),
    });

    const data = await res.json();
    setLoadingStatus(false);

    if (data.paymentStatus === "paid") {
      fetchPesanan();
      alert("Pembayaran berhasil dikonfirmasi! ✅");
    } else {
      alert("Pembayaran belum diterima. Silakan coba lagi setelah membayar.");
    }
  };

  const salin = (teks) => {
    navigator.clipboard.writeText(teks);
    setTersalin(true);
    setTimeout(() => setTersalin(false), 2000);
  };

  const pesanWhatsApp = () => {
    if (!pesanan) return;
    const pesan = `Halo Admin Distro Merbabu! 👋\n\nSaya ingin konfirmasi pesanan:\n\n🧾 ID Pesanan: #${pesanan.id}\n👤 Nama: ${pesanan.namaPenerima}\n💰 Total: Rp ${pesanan.total.toLocaleString("id-ID")}\n💳 Metode: QRIS\n\nMohon segera dikonfirmasi. Terima kasih!`;
    window.open(
      `https://wa.me/6208123456789?text=${encodeURIComponent(pesan)}`,
      "_blank",
    );
  };

  if (!pesanan) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-400 text-sm">Memuat pesanan...</p>
        </div>
      </main>
    );
  }

  const sudahBayar = pesanan.paymentStatus === "paid";

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 md:px-8 py-12 md:py-16">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">{sudahBayar ? "✅" : "🎉"}</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {sudahBayar ? "Pembayaran Berhasil!" : "Pesanan Berhasil Dibuat!"}
          </h1>
          <p className="text-gray-500 text-sm">
            {sudahBayar
              ? "Pesanan kamu sedang diproses oleh admin"
              : "Selesaikan pembayaran QRIS untuk memproses pesanan kamu"}
          </p>
        </div>

        {/* Detail pesanan */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-6 mb-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-gray-900">Detail Pesanan</h2>
            <span
              className={`text-xs px-3 py-1 rounded-full font-medium ${
                pesanan.status === "pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : pesanan.status === "diproses"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-green-100 text-green-700"
              }`}
            >
              {pesanan.status}
            </span>
          </div>

          <div className="text-sm text-gray-600 flex flex-col gap-1 mb-4">
            <p>
              ID Pesanan:{" "}
              <span className="font-semibold text-gray-900">#{pesanan.id}</span>
            </p>
            <p>
              Nama:{" "}
              <span className="font-semibold text-gray-900">
                {pesanan.namaPenerima}
              </span>
            </p>
            <p>
              Alamat:{" "}
              <span className="font-semibold text-gray-900">
                {pesanan.alamat}
              </span>
            </p>
            <p>
              Telepon:{" "}
              <span className="font-semibold text-gray-900">
                {pesanan.telepon}
              </span>
            </p>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <p className="text-sm font-medium text-gray-900 mb-3">
              Item Pesanan:
            </p>
            {pesanan.items?.map((item, index) => (
              <div
                key={index}
                className="flex justify-between text-sm text-gray-600 mb-2"
              >
                <span>
                  {item.produk?.nama}
                  <span className="text-gray-400 ml-1">x{item.jumlah}</span>
                </span>
                <span className="text-gray-900">
                  Rp {(item.harga * item.jumlah).toLocaleString("id-ID")}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-4 mt-2">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Subtotal produk</span>
              <span>
                Rp{" "}
                {(pesanan.total - (pesanan.ongkir || 0)).toLocaleString(
                  "id-ID",
                )}
              </span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mb-3">
              <span>
                Ongkir {pesanan.kotaTujuan ? `(${pesanan.kotaTujuan})` : ""}
              </span>
              <span>
                {(pesanan.ongkir || 0) === 0
                  ? "Gratis"
                  : `Rp ${pesanan.ongkir.toLocaleString("id-ID")}`}
              </span>
            </div>
            <div className="flex justify-between font-bold text-gray-900">
              <span>Total Bayar</span>
              <span>Rp {pesanan.total.toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>

        {/* Pembayaran QRIS */}
        {!sudahBayar && (
          <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-6 mb-4">
            <h2 className="font-bold text-gray-900 mb-4">📱 Pembayaran QRIS</h2>

            {!paymentData ? (
              /* Belum generate QRIS */
              <div>
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">📱</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        QRIS Universal
                      </p>
                      <p className="text-xs text-gray-500">
                        GoPay, OVO, Dana, ShopeePay, M-Banking, dan semua
                        e-wallet
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-black rounded-xl p-4 flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">
                      Total pembayaran
                    </p>
                    <p className="text-xl font-bold text-white">
                      Rp {pesanan.total.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleBuatPembayaran}
                  disabled={loadingPayment}
                  className="w-full bg-black text-white py-3.5 rounded-xl text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition"
                >
                  {loadingPayment ? "Membuat QRIS..." : "📱 Tampilkan QR Code"}
                </button>
              </div>
            ) : (
              /* Sudah ada QRIS */
              <div>
                <p className="text-sm text-gray-600 text-center mb-4">
                  Scan QR code berikut untuk membayar:
                </p>

                {/* QR Code */}
                <div className="flex justify-center mb-4">
                  <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                    {paymentData.payment_url ? (
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(paymentData.payment_url)}`}
                        alt="QRIS Payment"
                        className="w-52 h-52"
                      />
                    ) : (
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(paymentData.payment_number)}`}
                        alt="QRIS Payment"
                        className="w-52 h-52"
                      />
                    )}
                  </div>
                </div>

                <p className="text-xs text-gray-400 text-center mb-4">
                  Bisa dibayar dengan GoPay, OVO, Dana, ShopeePay,
                  <br />
                  LinkAja, dan semua aplikasi yang mendukung QRIS
                </p>

                {/* Total */}
                <div className="bg-black rounded-xl p-4 flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">
                      Total pembayaran
                    </p>
                    <p className="text-xl font-bold text-white">
                      Rp {pesanan.total.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <button
                    onClick={() => salin(pesanan.total.toString())}
                    className={`text-xs border px-3 py-1.5 rounded-lg transition ${
                      tersalin
                        ? "border-green-500 text-green-400"
                        : "border-gray-700 text-gray-400 hover:bg-gray-800"
                    }`}
                  >
                    {tersalin ? "✓ Tersalin" : "Salin"}
                  </button>
                </div>

                {/* Expired */}
                {paymentData.expired_at && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                    <p className="text-xs text-yellow-700 text-center">
                      ⏰ Bayar sebelum{" "}
                      <strong>
                        {new Date(paymentData.expired_at).toLocaleString(
                          "id-ID",
                        )}
                      </strong>
                    </p>
                  </div>
                )}

                {/* Tombol cek status */}
                <button
                  onClick={cekStatusPembayaran}
                  disabled={loadingStatus}
                  className="w-full bg-green-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition mb-2"
                >
                  {loadingStatus
                    ? "Mengecek pembayaran..."
                    : "🔄 Saya Sudah Bayar"}
                </button>

                <button
                  onClick={handleBuatPembayaran}
                  disabled={loadingPayment}
                  className="w-full border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm hover:bg-gray-50 disabled:opacity-50 transition"
                >
                  {loadingPayment ? "Memperbarui..." : "↻ Generate QR Baru"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Sudah bayar */}
        {sudahBayar && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-4 text-center">
            <p className="text-green-800 font-medium mb-1">
              ✅ Pembayaran Diterima
            </p>
            <p className="text-green-600 text-sm">
              Pesanan kamu sedang diproses oleh admin Distro Merbabu
            </p>
          </div>
        )}

        {/* Tombol aksi */}
        <div className="flex flex-col gap-3">
          <button
            onClick={pesanWhatsApp}
            className="w-full py-3.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition"
            style={{ background: "#25D366", color: "#fff" }}
          >
            💬 Hubungi Admin via WhatsApp
          </button>
          <Link
            href="/"
            className="w-full bg-black text-white py-3.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition text-center"
          >
            Kembali Belanja
          </Link>
        </div>
      </div>
    </main>
  );
}
