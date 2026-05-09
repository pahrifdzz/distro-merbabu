import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const ongkir = await prisma.ongkirKota.findMany({
    orderBy: { biaya: "asc" },
  });
  return NextResponse.json(ongkir);
}
