"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TambahVoucherPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    kode: "",
    diskon: "",
    tipe: "persen",
    minBelanja: "",
    maxDiskon: "",
    kuota: "1",
    aktif: true,
    expiredAt: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    console.log("handleSubmit dipanggil");
    console.log("form:", form);

    if (!form.kode || !form.diskon) {
      setError("Kode dan diskon wajib diisi");
      return;
    }
    if (
      form.tipe === "persen" &&
      (parseInt(form.diskon) < 1 || parseInt(form.diskon) > 100)
    ) {
      setError("Diskon persen harus antara 1-100");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/admin/voucher", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Gagal membuat voucher");
      setLoading(false);
      return;
    }

    router.push("/admin/voucher");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Tambah Voucher</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-lg">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3 mb-4">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-gray-800 block mb-1">
              Kode Voucher
            </label>
            <input
              type="text"
              placeholder="Contoh: MERBABU10"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-black uppercase"
              value={form.kode}
              onChange={(e) =>
                setForm({ ...form, kode: e.target.value.toUpperCase() })
              }
            />
            <p className="text-xs text-gray-400 mt-1">
              Otomatis diubah ke huruf kapital
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-800 block mb-2">
              Tipe Diskon
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setForm({ ...form, tipe: "persen" })}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition ${
                  form.tipe === "persen"
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                }`}
              >
                Persen (%)
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, tipe: "nominal" })}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition ${
                  form.tipe === "nominal"
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                }`}
              >
                Nominal (Rp)
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-800 block mb-1">
              Besar Diskon {form.tipe === "persen" ? "(%)" : "(Rp)"}
            </label>
            <input
              type="number"
              min="1"
              placeholder={
                form.tipe === "persen" ? "Contoh: 10" : "Contoh: 20000"
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-black"
              value={form.diskon}
              onChange={(e) => setForm({ ...form, diskon: e.target.value })}
            />
          </div>

          {form.tipe === "persen" && (
            <div>
              <label className="text-sm font-medium text-gray-800 block mb-1">
                Maksimal Diskon (Rp){" "}
                <span className="text-gray-400 font-normal">— opsional</span>
              </label>
              <input
                type="number"
                min="0"
                placeholder="Kosongkan jika tidak ada batas"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-black"
                value={form.maxDiskon}
                onChange={(e) =>
                  setForm({ ...form, maxDiskon: e.target.value })
                }
              />
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-800 block mb-1">
              Minimum Belanja (Rp){" "}
              <span className="text-gray-400 font-normal">— opsional</span>
            </label>
            <input
              type="number"
              min="0"
              placeholder="Kosongkan jika tidak ada minimum"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-black"
              value={form.minBelanja}
              onChange={(e) => setForm({ ...form, minBelanja: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-800 block mb-1">
              Kuota Pemakaian
            </label>
            <input
              type="number"
              min="1"
              placeholder="Jumlah maksimal pemakaian voucher"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-black"
              value={form.kuota}
              onChange={(e) => setForm({ ...form, kuota: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-800 block mb-1">
              Tanggal Kadaluarsa{" "}
              <span className="text-gray-400 font-normal">— opsional</span>
            </label>
            <input
              type="datetime-local"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-black"
              value={form.expiredAt}
              onChange={(e) => setForm({ ...form, expiredAt: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="aktif"
              checked={form.aktif}
              onChange={(e) => setForm({ ...form, aktif: e.target.checked })}
              className="w-4 h-4 rounded"
            />
            <label
              htmlFor="aktif"
              className="text-sm font-medium text-gray-800"
            >
              Voucher aktif
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : "Simpan Voucher"}
            </button>
            <button
              onClick={() => router.back()}
              className="border border-gray-200 text-gray-700 px-6 py-2.5 rounded-lg text-sm hover:bg-gray-50"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
