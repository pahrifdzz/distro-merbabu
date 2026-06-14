import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

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

    // Kirim simulasi ke Pakasir
    const res = await fetch("https://app.pakasir.com/api/paymentsimulation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        project: process.env.PAKASIR_SLUG,
        order_id: pesanan.paymentOrderId,
        amount: pesanan.total,
        api_key: process.env.PAKASIR_API_KEY,
      }),
    });

    const data = await res.json();
    console.log("Simulasi response:", JSON.stringify(data));

    if (!res.ok) {
      return NextResponse.json(
        { error: data.message || "Simulasi gagal" },
        { status: 400 },
      );
    }

    // Update status pesanan
    await prisma.pesanan.update({
      where: { id: pesanan.id },
      data: {
        paymentStatus: "paid",
        status: "diproses",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Simulasi error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
