import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
  const { id } = await params;
  const zona = await prisma.zonaOngkir.findUnique({
    where: { id: parseInt(id) },
  });
  if (!zona) {
    return NextResponse.json(
      { error: "Zona tidak ditemukan" },
      { status: 404 },
    );
  }
  return NextResponse.json(zona);
}

export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { namaZona, wilayah, biaya, estimasi } = await request.json();

  const zona = await prisma.zonaOngkir.update({
    where: { id: parseInt(id) },
    data: { namaZona, wilayah, biaya: parseInt(biaya), estimasi },
  });

  return NextResponse.json(zona);
}

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.zonaOngkir.delete({ where: { id: parseInt(id) } });

  return NextResponse.json({ message: "Zona berhasil dihapus" });
}
