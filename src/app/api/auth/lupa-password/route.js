import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { kirimEmailResetPassword } from "@/lib/email";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email wajib diisi" }, { status: 400 });
    }

    // Cari user
    const user = await prisma.user.findUnique({ where: { email } });

    // Selalu return sukses meski email tidak ditemukan (keamanan)
    if (!user) {
      return NextResponse.json({
        message: "Kalau email terdaftar, kode reset akan dikirim",
      });
    }

    // Generate kode 6 digit
    const kode = Math.floor(100000 + Math.random() * 900000).toString();

    // Expired 15 menit dari sekarang
    const expiredAt = new Date(Date.now() + 15 * 60 * 1000);

    // Nonaktifkan kode lama yang belum dipakai
    await prisma.resetPassword.updateMany({
      where: { userId: user.id, dipakai: false },
      data: { dipakai: true },
    });

    // Simpan kode baru
    await prisma.resetPassword.create({
      data: { userId: user.id, kode, expiredAt },
    });

    // Kirim email
    await kirimEmailResetPassword(user.email, user.nama, kode);

    return NextResponse.json({
      message: "Kode reset password berhasil dikirim ke email kamu",
    });
  } catch (error) {
    console.error("Error lupa password:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
