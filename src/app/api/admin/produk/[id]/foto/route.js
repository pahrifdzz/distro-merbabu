import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export async function GET(request, { params }) {
  const { id } = await params;
  const fotos = await prisma.fotoProduk.findMany({
    where: { produkId: parseInt(id) },
    orderBy: { urutan: "asc" },
  });
  return NextResponse.json(fotos);
}

export async function POST(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const formData = await request.formData();
  const file = formData.get("file");

  if (!file) {
    return NextResponse.json({ error: "File wajib diisi" }, { status: 400 });
  }

  const namaFile = `produk-${id}-${Date.now()}`;
  const buffer = await file.arrayBuffer();

  const { error: uploadError } = await supabase.storage
    .from("produk-images")
    .upload(namaFile, buffer, { contentType: file.type });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data } = supabase.storage
    .from("produk-images")
    .getPublicUrl(namaFile);

  // Hitung urutan berikutnya
  const jumlahFoto = await prisma.fotoProduk.count({
    where: { produkId: parseInt(id) },
  });

  const foto = await prisma.fotoProduk.create({
    data: {
      produkId: parseInt(id),
      url: data.publicUrl,
      urutan: jumlahFoto,
    },
  });

  // Update gambar utama kalau ini foto pertama
  if (jumlahFoto === 0) {
    await prisma.produk.update({
      where: { id: parseInt(id) },
      data: { gambar: data.publicUrl },
    });
  }

  return NextResponse.json(foto, { status: 201 });
}

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { fotoId } = await request.json();

  const foto = await prisma.fotoProduk.findUnique({
    where: { id: fotoId },
  });

  if (!foto) {
    return NextResponse.json(
      { error: "Foto tidak ditemukan" },
      { status: 404 },
    );
  }

  await prisma.fotoProduk.delete({ where: { id: fotoId } });

  // Update gambar utama ke foto pertama yang tersisa
  const fotoTersisa = await prisma.fotoProduk.findFirst({
    where: { produkId: parseInt(id) },
    orderBy: { urutan: "asc" },
  });

  await prisma.produk.update({
    where: { id: parseInt(id) },
    data: { gambar: fotoTersisa?.url || null },
  });

  return NextResponse.json({ message: "Foto berhasil dihapus" });
}
