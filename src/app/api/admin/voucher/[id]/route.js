import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { kode, diskon, tipe, minBelanja, maxDiskon, kuota, aktif, expiredAt } =
    await request.json();

  const voucher = await prisma.voucher.update({
    where: { id: parseInt(id) },
    data: {
      kode: kode.toUpperCase(),
      diskon: parseInt(diskon),
      tipe,
      minBelanja: parseInt(minBelanja) || 0,
      maxDiskon: maxDiskon ? parseInt(maxDiskon) : null,
      kuota: parseInt(kuota) || 1,
      aktif,
      expiredAt: expiredAt ? new Date(expiredAt) : null,
    },
  });

  return NextResponse.json(voucher);
}

export async function GET(request, { params }) {
  const { id } = await params;
  const voucher = await prisma.voucher.findUnique({
    where: { id: parseInt(id) },
  });
  if (!voucher) {
    return NextResponse.json(
      { error: "Voucher tidak ditemukan" },
      { status: 404 },
    );
  }
  return NextResponse.json(voucher);
}

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.voucher.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ message: "Voucher berhasil dihapus" });
}
