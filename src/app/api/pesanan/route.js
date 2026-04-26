import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Kamu harus login untuk melakukan pesanan" },
        { status: 401 },
      );
    }

    const { items, total, alamat, telepon, nama } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Keranjang kosong" }, { status: 400 });
    }

    // Buat pesanan di database
    const pesanan = await prisma.pesanan.create({
      data: {
        userId: session.user.id,
        total,
        alamat,
        telepon,
        namaPenerima: nama,
        status: "pending",
        items: {
          create: items.map((item) => ({
            produkId: item.id,
            jumlah: item.jumlah,
            harga: item.harga,
          })),
        },
      },
    });

    return NextResponse.json(
      { message: "Pesanan berhasil dibuat", pesananId: pesanan.id },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
