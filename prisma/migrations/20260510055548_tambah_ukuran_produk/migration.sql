-- CreateTable
CREATE TABLE "UkuranProduk" (
    "id" SERIAL NOT NULL,
    "produkId" INTEGER NOT NULL,
    "ukuran" TEXT NOT NULL,
    "stok" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UkuranProduk_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UkuranProduk" ADD CONSTRAINT "UkuranProduk_produkId_fkey" FOREIGN KEY ("produkId") REFERENCES "Produk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
