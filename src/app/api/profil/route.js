import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      nama: true,
      email: true,
      telepon: true,
      alamat: true,
      role: true,
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: "User tidak ditemukan" },
      { status: 404 },
    );
  }

  return NextResponse.json(user);
}

export async function PUT(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { nama, telepon, alamat } = body;

    // Validasi nomor telepon
    if (telepon && !/^[0-9+\-\s]{8,15}$/.test(telepon)) {
      return NextResponse.json(
        { error: "Format nomor telepon tidak valid" },
        { status: 400 },
      );
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        nama: nama || undefined,
        telepon: telepon || null,
        alamat: alamat || null,
      },
      select: {
        id: true,
        nama: true,
        email: true,
        telepon: true,
        alamat: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error update profil:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
