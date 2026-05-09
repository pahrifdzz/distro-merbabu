"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TombolHapusOngkir({ id, kota }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleHapus = async () => {
    if (!confirm(`Hapus ongkir untuk kota ${kota}?`)) return;
    setLoading(true);

    const res = await fetch(`/api/admin/ongkir/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.refresh();
    } else {
      alert("Gagal menghapus");
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleHapus}
      disabled={loading}
      className="text-xs border border-red-200 px-2 md:px-3 py-1.5 rounded-lg hover:bg-red-50 text-red-600 disabled:opacity-50"
    >
      {loading ? "..." : "Hapus"}
    </button>
  );
}
