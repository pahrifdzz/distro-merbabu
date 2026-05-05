import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const pesanan = await prisma.pesanan.findUnique({
    where: { id: parseInt(id) },
    include: {
      items: {
        include: { produk: true },
      },
      user: true,
    },
  });

  if (!pesanan) {
    return NextResponse.json(
      { error: "Pesanan tidak ditemukan" },
      { status: 404 },
    );
  }

  return NextResponse.json(pesanan);
}
