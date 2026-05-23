import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const voucher = await prisma.voucher.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(voucher);
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const {
      kode,
      diskon,
      tipe,
      minBelanja,
      maxDiskon,
      kuota,
      aktif,
      expiredAt,
    } = await request.json();

    if (!kode || !diskon) {
      return NextResponse.json(
        { error: "Kode dan diskon wajib diisi" },
        { status: 400 },
      );
    }

    // Cek apakah kode sudah ada
    const sudahAda = await prisma.voucher.findUnique({
      where: { kode: kode.toUpperCase() },
    });

    if (sudahAda) {
      return NextResponse.json(
        {
          error: `Kode voucher "${kode.toUpperCase()}" sudah digunakan. Gunakan kode lain.`,
        },
        { status: 400 },
      );
    }

    const voucher = await prisma.voucher.create({
      data: {
        kode: kode.toUpperCase(),
        diskon: parseInt(diskon),
        tipe: tipe || "persen",
        minBelanja: parseInt(minBelanja) || 0,
        maxDiskon: maxDiskon ? parseInt(maxDiskon) : null,
        kuota: parseInt(kuota) || 1,
        aktif: aktif !== false,
        expiredAt: expiredAt ? new Date(expiredAt) : null,
      },
    });

    return NextResponse.json(voucher, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
