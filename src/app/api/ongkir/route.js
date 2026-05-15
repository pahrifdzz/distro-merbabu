import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const zona = await prisma.zonaOngkir.findMany({
    orderBy: { biaya: "asc" },
  });
  return NextResponse.json(zona);
}
