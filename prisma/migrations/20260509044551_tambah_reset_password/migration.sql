-- CreateTable
CREATE TABLE "ResetPassword" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "kode" TEXT NOT NULL,
    "expiredAt" TIMESTAMP(3) NOT NULL,
    "dipakai" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResetPassword_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ResetPassword" ADD CONSTRAINT "ResetPassword_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
