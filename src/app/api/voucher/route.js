import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
  try {
    const { kode, totalBelanja } = await request.json();

    if (!kode) {
      return NextResponse.json(
        { error: "Kode voucher wajib diisi" },
        { status: 400 },
      );
    }

    const voucher = await prisma.voucher.findUnique({
      where: { kode: kode.toUpperCase() },
    });

    if (!voucher) {
      return NextResponse.json(
        { error: "Kode voucher tidak ditemukan" },
        { status: 404 },
      );
    }

    if (!voucher.aktif) {
      return NextResponse.json(
        { error: "Voucher sudah tidak aktif" },
        { status: 400 },
      );
    }

    if (voucher.expiredAt && new Date() > new Date(voucher.expiredAt)) {
      return NextResponse.json(
        { error: "Voucher sudah kadaluarsa" },
        { status: 400 },
      );
    }

    if (voucher.terpakai >= voucher.kuota) {
      return NextResponse.json(
        { error: "Kuota voucher sudah habis" },
        { status: 400 },
      );
    }

    if (totalBelanja < voucher.minBelanja) {
      return NextResponse.json(
        {
          error: `Minimum belanja Rp ${voucher.minBelanja.toLocaleString("id-ID")} untuk menggunakan voucher ini`,
        },
        { status: 400 },
      );
    }

    // Hitung diskon
    let nilaiDiskon = 0;
    if (voucher.tipe === "persen") {
      nilaiDiskon = Math.floor((totalBelanja * voucher.diskon) / 100);
      if (voucher.maxDiskon && nilaiDiskon > voucher.maxDiskon) {
        nilaiDiskon = voucher.maxDiskon;
      }
    } else {
      nilaiDiskon = voucher.diskon;
    }

    // Pastikan diskon tidak melebihi total belanja
    if (nilaiDiskon > totalBelanja) nilaiDiskon = totalBelanja;

    return NextResponse.json({
      valid: true,
      kode: voucher.kode,
      tipe: voucher.tipe,
      diskon: voucher.diskon,
      nilaiDiskon,
      pesan: `Voucher berhasil! Hemat Rp ${nilaiDiskon.toLocaleString("id-ID")}`,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
