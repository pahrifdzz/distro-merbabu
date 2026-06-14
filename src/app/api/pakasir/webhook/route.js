import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
  try {
    const body = await request.json();
    console.log("Pakasir webhook:", body);

    const { order_id, status, amount } = body;

    if (!order_id) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Cari pesanan berdasarkan paymentOrderId
    const pesanan = await prisma.pesanan.findFirst({
      where: { paymentOrderId: order_id },
    });

    if (!pesanan) {
      return NextResponse.json(
        { error: "Pesanan tidak ditemukan" },
        { status: 404 },
      );
    }

    // Update status berdasarkan webhook
    if (status === "paid" || status === "success") {
      await prisma.pesanan.update({
        where: { id: pesanan.id },
        data: {
          paymentStatus: "paid",
          status: "diproses",
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
