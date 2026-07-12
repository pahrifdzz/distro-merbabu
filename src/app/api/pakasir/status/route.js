import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import pakasir from "@/lib/pakasir";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { pesananId } = await request.json();

    const pesanan = await prisma.pesanan.findUnique({
      where: { id: parseInt(pesananId) },
    });

    if (!pesanan || !pesanan.paymentOrderId) {
      return NextResponse.json(
        { error: "Pesanan tidak ditemukan" },
        { status: 404 },
      );
    }

    // Cek status ke Pakasir. detailPayment() mengembalikan objek flat dengan
    // .status bernilai "pending" | "completed" | "canceled".
    const detail = await pakasir.detailPayment(
      pesanan.paymentOrderId,
      pesanan.total,
    );

    const sudahLunas = detail.status === "completed";

    // Idempotent: update DB hanya jika transaksi completed dan pesanan belum paid.
    // Hanya naikkan pending → diproses, jangan turunkan pesanan yang sudah selesai.
    if (sudahLunas && pesanan.paymentStatus !== "paid") {
      await prisma.pesanan.update({
        where: { id: pesanan.id },
        data: {
          paymentStatus: "paid",
          ...(pesanan.status === "pending" ? { status: "diproses" } : {}),
        },
      });
    }

    // Frontend mengecek `paymentStatus === "paid"`. Petakan status Pakasir
    // "completed" ke "paid" agar konsisten dengan skema DB & UI.
    const paymentStatus = sudahLunas ? "paid" : pesanan.paymentStatus;
    const pesananStatus =
      sudahLunas && pesanan.status === "pending" ? "diproses" : pesanan.status;

    return NextResponse.json({
      paymentStatus,
      pesananStatus,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal cek status" }, { status: 500 });
  }
}
