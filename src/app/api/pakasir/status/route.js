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

    // Cek status ke Pakasir
    const detail = await pakasir.detailPayment(
      pesanan.paymentOrderId,
      pesanan.total,
    );

    // Update status kalau sudah dibayar
    if (detail.payment?.status === "paid") {
      await prisma.pesanan.update({
        where: { id: pesanan.id },
        data: {
          paymentStatus: "paid",
          status: "diproses",
        },
      });
    }

    return NextResponse.json({
      paymentStatus: detail.payment?.status || pesanan.paymentStatus,
      pesananStatus: pesanan.status,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal cek status" }, { status: 500 });
  }
}
