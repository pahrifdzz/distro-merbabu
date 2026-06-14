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

    if (!pesanan) {
      return NextResponse.json(
        { error: "Pesanan tidak ditemukan" },
        { status: 404 },
      );
    }

    const orderId = `MERBABU-${pesanan.id}-${Date.now()}`;

    const result = await pakasir.createPayment(
      "qris",
      orderId,
      pesanan.total,
      `${process.env.NEXTAUTH_URL}/pesanan/${pesanan.id}`,
    );

    // Response langsung di root, bukan nested di result.payment
    await prisma.pesanan.update({
      where: { id: pesanan.id },
      data: {
        metodePembayaran: "qris",
        paymentOrderId: orderId,
        paymentNumber: result?.payment_number || null,
        paymentExpiredAt: result?.expired_at
          ? new Date(result.expired_at)
          : null,
        paymentStatus: "unpaid",
      },
    });

    return NextResponse.json({
      success: true,
      orderId,
      payment: result, // ← kirim result langsung
    });
  } catch (error) {
    console.error("Pakasir error:", error);
    return NextResponse.json(
      { error: "Gagal membuat pembayaran" },
      { status: 500 },
    );
  }
}
