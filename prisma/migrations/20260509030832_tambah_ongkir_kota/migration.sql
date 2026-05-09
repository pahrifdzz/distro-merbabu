-- CreateTable
CREATE TABLE "OngkirKota" (
    "id" SERIAL NOT NULL,
    "kota" TEXT NOT NULL,
    "biaya" INTEGER NOT NULL,
    "estimasi" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OngkirKota_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OngkirKota_kota_key" ON "OngkirKota"("kota");
