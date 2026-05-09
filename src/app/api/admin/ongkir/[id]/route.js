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
  const { kota, biaya, estimasi } = await request.json();

  const ongkir = await prisma.ongkirKota.update({
    where: { id: parseInt(id) },
    data: { kota, biaya, estimasi },
  });

  return NextResponse.json(ongkir);
}

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  await prisma.ongkirKota.delete({ where: { id: parseInt(id) } });

  return NextResponse.json({ message: "Ongkir berhasil dihapus" });
}
