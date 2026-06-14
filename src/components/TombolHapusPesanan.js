"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TombolHapusPesanan({ id, status }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Admin hanya bisa hapus pesanan yang sudah selesai
  if (status !== "selesai") return null;

  const handleHapus = async () => {
    if (!confirm("Hapus riwayat pesanan ini secara permanen?")) return;
    setLoading(true);

    const res = await fetch(`/api/admin/pesanan/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json();
      alert(data.error || "Gagal menghapus pesanan");
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleHapus}
      disabled={loading}
      className="text-xs border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 text-red-600 disabled:opacity-50"
    >
      {loading ? "..." : "Hapus"}
    </button>
  );
}
