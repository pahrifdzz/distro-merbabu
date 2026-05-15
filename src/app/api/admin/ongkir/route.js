import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { namaZona, wilayah, biaya, estimasi } = await request.json();

  const zona = await prisma.zonaOngkir.create({
    data: { namaZona, wilayah, biaya, estimasi },
  });

  return NextResponse.json(zona, { status: 201 });
}
