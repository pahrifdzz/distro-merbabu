-- AlterTable
ALTER TABLE "Pesanan" ADD COLUMN     "kotaTujuan" TEXT,
ADD COLUMN     "ongkir" INTEGER NOT NULL DEFAULT 0;
