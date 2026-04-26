import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { nama, harga, kategori, deskripsi } = await request.json();

  const produk = await prisma.produk.create({
    data: { nama, harga, kategori, deskripsi },
  });

  return NextResponse.json(produk, { status: 201 });
}

export async function DELETE(request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await request.json();

  await prisma.produk.delete({ where: { id } });

  return NextResponse.json({ message: "Produk berhasil dihapus" });
}
