-- CreateTable
CREATE TABLE "FotoProduk" (
    "id" SERIAL NOT NULL,
    "produkId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "urutan" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FotoProduk_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FotoProduk" ADD CONSTRAINT "FotoProduk_produkId_fkey" FOREIGN KEY ("produkId") REFERENCES "Produk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
