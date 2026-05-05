"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function KonfirmasiPesanan() {
  const { id } = useParams();
  const [pesanan, setPesanan] = useState(null);
  const [tersalin, setTersalin] = useState(false);
  const [tersalinTotal, setTersalinTotal] = useState(false);
  const [fileBukti, setFileBukti] = useState(null);
  const [previewBukti, setPreviewBukti] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadBerhasil, setUploadBerhasil] = useState(false);

  useEffect(() => {
    fetch(`/api/pesanan/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPesanan(data);
        if (data.buktiPembayaran) {
          setUploadBerhasil(true);
          setPreviewBukti(data.buktiPembayaran);
        }
      });
  }, [id]);

  const salinRekening = () => {
    navigator.clipboard.writeText("1123344500");
    setTersalin(true);
    setTimeout(() => setTersalin(false), 2000);
  };

  const handleFileBukti = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar!");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran foto maksimal 2MB!");
      return;
    }
    setFileBukti(file);
    setPreviewBukti(URL.createObjectURL(file));
  };

  const handleUploadBukti = async () => {
    if (!fileBukti) return;
    setUploadLoading(true);

    const formData = new FormData();
    formData.append("file", fileBukti);
    formData.append("pesananId", id);

    const res = await fetch("/api/pesanan/bukti", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      setUploadBerhasil(true);
    } else {
      alert("Gagal upload bukti pembayaran");
    }

    setUploadLoading(false);
  };

  const pesanWhatsApp = () => {
    if (!pesanan) return;
    const pesan = `Halo Admin Distro Merbabu! 👋\n\nSaya ingin konfirmasi pembayaran:\n\n🧾 ID Pesanan: #${pesanan.id}\n👤 Nama: ${pesanan.namaPenerima}\n💰 Total: Rp ${pesanan.total.toLocaleString("id-ID")}\n\nSaya sudah melakukan transfer ke rekening BCA 1123344500 dan sudah upload bukti pembayaran. Mohon segera dikonfirmasi. Terima kasih!`;
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

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 md:px-8 py-12 md:py-16">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Pesanan Berhasil Dibuat!
          </h1>
          <p className="text-gray-500 text-sm">
            Terima kasih sudah berbelanja di Distro Merbabu
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
            {pesanan.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between text-sm text-gray-600 mb-2"
              >
                <span>
                  {item.produk.nama}{" "}
                  <span className="text-gray-400">x{item.jumlah}</span>
                </span>
                <span className="text-gray-900">
                  Rp {(item.harga * item.jumlah).toLocaleString("id-ID")}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-4 mt-2 flex justify-between font-bold text-gray-900">
            <span>Total</span>
            <span>Rp {pesanan.total.toLocaleString("id-ID")}</span>
          </div>
        </div>

        {/* Instruksi pembayaran */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-6 mb-4">
          <h2 className="font-bold text-gray-900 mb-4">
            💳 Instruksi Pembayaran
          </h2>

          {/* Batas waktu */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <p className="text-xs text-yellow-700 font-medium">
              ⏰ Selesaikan pembayaran dalam <strong>24 jam</strong> agar
              pesanan tidak dibatalkan.
            </p>
          </div>

          {/* Info rekening */}
          <div className="bg-gray-50 rounded-xl p-4 mb-3">
            <p className="text-xs text-gray-400 uppercase font-medium mb-3">
              Transfer ke rekening
            </p>
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Bank BCA</p>
                <p className="text-xl font-bold text-gray-900 tracking-wider">
                  1123 3445 00
                </p>
                <p className="text-sm text-gray-600 mt-0.5">
                  a/n Distro Merbabu
                </p>
              </div>
              <button
                onClick={salinRekening}
                className={`text-xs px-4 py-2 rounded-lg border transition ${
                  tersalin
                    ? "bg-green-50 border-green-200 text-green-700"
                    : "border-gray-200 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tersalin ? "✓ Tersalin!" : "Salin"}
              </button>
            </div>
          </div>

          {/* Jumlah transfer */}
          <div className="bg-black rounded-xl p-4 mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 mb-1">Jumlah transfer</p>
              <p className="text-xl font-bold text-white">
                Rp {pesanan.total.toLocaleString("id-ID")}
              </p>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(pesanan.total.toString());
                setTersalinTotal(true);
                setTimeout(() => setTersalinTotal(false), 2000);
              }}
              className={`text-xs border px-3 py-1.5 rounded-lg transition ${
                tersalinTotal
                  ? "border-green-500 text-green-400"
                  : "border-gray-700 text-gray-400 hover:bg-gray-800"
              }`}
            >
              {tersalinTotal ? "✓ Tersalin!" : "Salin"}
            </button>
          </div>

          {/* Upload bukti pembayaran */}
          <div className="border border-gray-200 rounded-xl p-4 mb-4">
            <p className="text-sm font-medium text-gray-900 mb-3">
              📎 Upload Bukti Pembayaran
            </p>

            {uploadBerhasil ? (
              <div className="text-center">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                  <p className="text-sm text-green-700 font-medium">
                    ✅ Bukti pembayaran berhasil diupload!
                  </p>
                </div>
                {previewBukti && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewBukti}
                    alt="Bukti pembayaran"
                    className="w-full max-h-48 object-contain rounded-lg border border-gray-200"
                  />
                )}
              </div>
            ) : (
              <>
                <div
                  onClick={() => document.getElementById("inputBukti").click()}
                  className="w-full h-32 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-300 transition overflow-hidden mb-3"
                >
                  {previewBukti ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={previewBukti}
                      alt="preview"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-center">
                      <p className="text-2xl mb-1">📷</p>
                      <p className="text-xs text-gray-400">
                        Klik untuk pilih foto bukti transfer
                      </p>
                      <p className="text-xs text-gray-300 mt-1">Maks. 2MB</p>
                    </div>
                  )}
                </div>

                <input
                  id="inputBukti"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileBukti}
                />

                {fileBukti && (
                  <button
                    onClick={handleUploadBukti}
                    disabled={uploadLoading}
                    className="w-full bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-50 transition"
                  >
                    {uploadLoading
                      ? "Mengupload..."
                      : "Upload Bukti Pembayaran"}
                  </button>
                )}
              </>
            )}
          </div>

          {/* Langkah pembayaran */}
          <div className="flex flex-col gap-2">
            {[
              "Transfer sesuai jumlah di atas ke rekening BCA",
              "Upload bukti transfer di form di atas",
              "Klik tombol Hubungi Admin di bawah",
              "Admin akan mengkonfirmasi pesanan kamu",
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs text-gray-600 font-medium">
                    {i + 1}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tombol aksi */}
        <div className="flex flex-col gap-3">
          <button
            onClick={pesanWhatsApp}
            className="w-full py-3.5 rounded-xl text-sm font-medium transition flex items-center justify-center gap-2"
            style={{ background: "#25D366", color: "#fff" }}
          >
            <span>💬</span> Hubungi Admin via WhatsApp
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
