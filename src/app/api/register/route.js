import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

function validasiPassword(password) {
  if (password.length > 9) {
    return "Password maksimal 9 karakter";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password harus mengandung minimal 1 huruf kapital";
  }
  if (!/[0-9]/.test(password)) {
    return "Password harus mengandung minimal 1 angka";
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return "Password harus mengandung minimal 1 simbol unik";
  }
  return null;
}

export async function POST(request) {
  try {
    const { nama, email, password } = await request.json();

    if (!nama || !email || !password) {
      return NextResponse.json(
        { error: "Semua field wajib diisi" },
        { status: 400 },
      );
    }

    const errorPassword = validasiPassword(password);
    if (errorPassword) {
      return NextResponse.json({ error: errorPassword }, { status: 400 });
    }

    const userAda = await prisma.user.findUnique({ where: { email } });

    if (userAda) {
      return NextResponse.json(
        { error: "Email sudah terdaftar" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { nama, email, password: hashedPassword },
    });

    return NextResponse.json(
      { message: "Registrasi berhasil", userId: user.id },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
