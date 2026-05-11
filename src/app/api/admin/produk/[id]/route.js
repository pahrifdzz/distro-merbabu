import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
  const { id } = await params;
  const produk = await prisma.produk.findUnique({
    where: { id: parseInt(id) },
    include: { ukurans: true, fotos: { orderBy: { urutan: "asc" } } },
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
  const { nama, harga, kategori, deskripsi, stok, ukurans } =
    await request.json();

  // Hapus ukuran lama lalu buat ulang
  await prisma.ukuranProduk.deleteMany({
    where: { produkId: parseInt(id) },
  });

  const produk = await prisma.produk.update({
    where: { id: parseInt(id) },
    data: {
      nama,
      harga,
      kategori,
      deskripsi,
      stok: stok || 0,
      ukurans:
        ukurans?.length > 0
          ? {
              create: ukurans.map((u) => ({ ukuran: u.ukuran, stok: u.stok })),
            }
          : undefined,
    },
  });

  return NextResponse.json(produk);
}

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  await prisma.pesananItem.deleteMany({ where: { produkId: parseInt(id) } });
  await prisma.fotoProduk.deleteMany({ where: { produkId: parseInt(id) } });
  await prisma.ukuranProduk.deleteMany({ where: { produkId: parseInt(id) } });
  await prisma.produk.delete({ where: { id: parseInt(id) } });

  return NextResponse.json({ message: "Produk berhasil dihapus" });
}
