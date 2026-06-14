/*
  Warnings:

  - You are about to drop the column `layanan` on the `Pesanan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Pesanan" DROP COLUMN "layanan",
ADD COLUMN     "metodePembayaran" TEXT,
ADD COLUMN     "paymentExpiredAt" TIMESTAMP(3),
ADD COLUMN     "paymentNumber" TEXT,
ADD COLUMN     "paymentOrderId" TEXT,
ADD COLUMN     "paymentStatus" TEXT NOT NULL DEFAULT 'unpaid';
