import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import pakasir from "@/lib/pakasir";

export async function POST(request) {
  try {
    const body = await request.json();
    console.log("Pakasir webhook:", body);

    // Payload webhook Pakasir: { amount, order_id, project, status, payment_method, completed_at }
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

    // Pakasir menandai transaksi berhasil dengan status "completed" (bukan "paid")
    if (status !== "completed") {
      // Event non-completed (mis. pending/canceled) — cukup akui, jangan ubah status
      return NextResponse.json({ success: true });
    }

    // Security: pastikan nominal webhook sama dengan total pesanan supaya
    // pihak lain tidak bisa menandai pesanan lunas dengan payload palsu.
    if (Number(amount) !== pesanan.total) {
      console.warn(
        `Webhook amount mismatch untuk order ${order_id}: webhook=${amount}, pesanan=${pesanan.total}`,
      );
      return NextResponse.json(
        { error: "Amount tidak sesuai" },
        { status: 400 },
      );
    }

    // Idempotent: kalau sudah paid, akui saja agar Pakasir berhenti retry.
    if (pesanan.paymentStatus === "paid") {
      return NextResponse.json({ success: true });
    }

    // Rekomendasi dok Pakasir: verifikasi ulang status via API transactiondetail
    // sebelum mengubah data — jangan hanya percaya body webhook.
    let detail;
    try {
      detail = await pakasir.detailPayment(order_id, pesanan.total);
    } catch (err) {
      console.error("Webhook verifikasi detailPayment gagal:", err);
      return NextResponse.json(
        { error: "Verifikasi pembayaran gagal" },
        { status: 502 },
      );
    }

    if (detail.status !== "completed") {
      console.warn(
        `Webhook diklaim completed tapi detailPayment status=${detail.status} untuk order ${order_id}`,
      );
      return NextResponse.json(
        { error: "Status pembayaran belum completed" },
        { status: 409 },
      );
    }

    // Hanya naikkan pending → diproses. Jangan turunkan pesanan yang sudah
    // "selesai" kembali ke "diproses".
    await prisma.pesanan.update({
      where: { id: pesanan.id },
      data: {
        paymentStatus: "paid",
        ...(pesanan.status === "pending" ? { status: "diproses" } : {}),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
