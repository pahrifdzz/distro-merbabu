import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const { email, kode, passwordBaru } = await request.json();

    if (!email || !kode || !passwordBaru) {
      return NextResponse.json(
        { error: "Semua field wajib diisi" },
        { status: 400 },
      );
    }

    if (passwordBaru.length < 6) {
      return NextResponse.json(
        { error: "Password minimal 6 karakter" },
        { status: 400 },
      );
    }

    // Cari user
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json(
        { error: "Email tidak ditemukan" },
        { status: 404 },
      );
    }

    // Cari kode yang valid
    const resetData = await prisma.resetPassword.findFirst({
      where: {
        userId: user.id,
        kode,
        dipakai: false,
        expiredAt: { gt: new Date() },
      },
    });

    if (!resetData) {
      return NextResponse.json(
        { error: "Kode tidak valid atau sudah expired" },
        { status: 400 },
      );
    }

    // Hash password baru
    const hashedPassword = await bcrypt.hash(passwordBaru, 10);

    // Update password user
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // Tandai kode sudah dipakai
    await prisma.resetPassword.update({
      where: { id: resetData.id },
      data: { dipakai: true },
    });

    return NextResponse.json({ message: "Password berhasil direset!" });
  } catch (error) {
    console.error("Error reset password:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
