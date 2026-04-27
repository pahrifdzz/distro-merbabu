import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
  const { id } = await params;

  const produk = await prisma.produk.findUnique({
    where: { id: parseInt(id) },
  });

  if (!produk) {
    return NextResponse.json(
      { error: "Produk tidak ditemukan" },
      { status: 404 },
    );
  }

  return NextResponse.json(produk);
}

export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { nama, harga, kategori, deskripsi } = await request.json();

  const produk = await prisma.produk.update({
    where: { id: parseInt(id) },
    data: { nama, harga, kategori, deskripsi },
  });

  return NextResponse.json(produk);
}

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const produkId = parseInt(id);

  try {
    // Hapus dulu semua PesananItem yang terkait produk ini
    await prisma.pesananItem.deleteMany({
      where: { produkId },
    });

    // Baru hapus produknya
    await prisma.produk.delete({
      where: { id: produkId },
    });

    return NextResponse.json({ message: "Produk berhasil dihapus" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Gagal menghapus produk" },
      { status: 500 },
    );
  }
}
