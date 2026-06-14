import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const pesanan = await prisma.pesanan.findUnique({
      where: { id: parseInt(id) },
    });

    if (!pesanan) {
      return NextResponse.json(
        { error: "Pesanan tidak ditemukan" },
        { status: 404 },
      );
    }

    // Pastikan user hanya bisa hapus pesanannya sendiri
    if (pesanan.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Hanya boleh hapus pesanan yang sudah selesai
    if (pesanan.status !== "selesai") {
      return NextResponse.json(
        {
          error:
            "Hanya pesanan yang sudah selesai yang bisa dihapus dari riwayat",
        },
        { status: 400 },
      );
    }

    await prisma.pesananItem.deleteMany({
      where: { pesananId: parseInt(id) },
    });

    await prisma.pesanan.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({
      message: "Pesanan berhasil dihapus dari riwayat",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Gagal menghapus pesanan" },
      { status: 500 },
    );
  }
}
