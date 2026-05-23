-- CreateTable
CREATE TABLE "Voucher" (
    "id" SERIAL NOT NULL,
    "kode" TEXT NOT NULL,
    "diskon" INTEGER NOT NULL,
    "tipe" TEXT NOT NULL DEFAULT 'persen',
    "minBelanja" INTEGER NOT NULL DEFAULT 0,
    "maxDiskon" INTEGER,
    "kuota" INTEGER NOT NULL DEFAULT 1,
    "terpakai" INTEGER NOT NULL DEFAULT 0,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "expiredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Voucher_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Voucher_kode_key" ON "Voucher"("kode");
