"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TombolStatusPesanan({ id, statusSaat }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const statusBerikutnya = {
    pending: {
      label: "Konfirmasi",
      next: "diproses",
      warna: "text-blue-600 border-blue-200 hover:bg-blue-50",
    },
    diproses: {
      label: "Selesaikan",
      next: "selesai",
      warna: "text-green-600 border-green-200 hover:bg-green-50",
    },
    selesai: null,
  };

  const aksi = statusBerikutnya[statusSaat];

  if (!aksi) {
    return <span className="text-xs text-gray-300">—</span>;
  }

  const handleUpdate = async () => {
    setLoading(true);

    const res = await fetch(`/api/admin/pesanan/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: aksi.next }),
    });

    if (res.ok) {
      router.refresh();
    } else {
      alert("Gagal update status");
    }

    setLoading(false);
  };

  return (
    <button
      onClick={handleUpdate}
      disabled={loading}
      className={`text-xs border px-3 py-1.5 rounded-lg disabled:opacity-50 ${aksi.warna}`}
    >
      {loading ? "..." : aksi.label}
    </button>
  );
}
