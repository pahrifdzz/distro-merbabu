/*
  Warnings:

  - You are about to drop the `OngkirKota` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "OngkirKota";

-- CreateTable
CREATE TABLE "ZonaOngkir" (
    "id" SERIAL NOT NULL,
    "namaZona" TEXT NOT NULL,
    "wilayah" TEXT NOT NULL,
    "biaya" INTEGER NOT NULL,
    "estimasi" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ZonaOngkir_pkey" PRIMARY KEY ("id")
);
