-- AddForeignKey
ALTER TABLE "PesananItem" ADD CONSTRAINT "PesananItem_produkId_fkey" FOREIGN KEY ("produkId") REFERENCES "Produk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
