import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const pesananId = formData.get("pesananId");

  if (!file || !pesananId) {
    return NextResponse.json(
      { error: "File dan ID pesanan wajib diisi" },
      { status: 400 },
    );
  }

  // Upload ke Supabase Storage
  const namaFile = `bukti-${pesananId}-${Date.now()}`;
  const buffer = await file.arrayBuffer();

  const { error: uploadError } = await supabase.storage
    .from("produk-images")
    .upload(namaFile, buffer, { contentType: file.type });

  if (uploadError) {
    return NextResponse.json(
      { error: "Gagal upload: " + uploadError.message },
      { status: 500 },
    );
  }

  const { data } = supabase.storage
    .from("produk-images")
    .getPublicUrl(namaFile);

  // Simpan URL bukti ke database
  await prisma.pesanan.update({
    where: { id: parseInt(pesananId) },
    data: { buktiPembayaran: data.publicUrl },
  });

  return NextResponse.json({ url: data.publicUrl });
}
