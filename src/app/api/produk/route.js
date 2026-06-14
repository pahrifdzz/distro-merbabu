import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const produk = await prisma.produk.findMany({
    orderBy: { createdAt: "desc" },
    include: { ukurans: true },
  });
  return NextResponse.json(produk);
}
