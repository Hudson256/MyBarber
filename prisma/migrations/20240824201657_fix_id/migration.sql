/*
  Warnings:

  - Added the required column `barbershopId` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "barbershopId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Rating" ALTER COLUMN "updatedAt" DROP DEFAULT,
ALTER COLUMN "userName" DROP DEFAULT;

-- CreateTable
CREATE TABLE "BarbershopUser" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "barbershopId" TEXT NOT NULL,

    CONSTRAINT "BarbershopUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BarbershopUser_userId_barbershopId_key" ON "BarbershopUser"("userId", "barbershopId");

-- AddForeignKey
ALTER TABLE "BarbershopUser" ADD CONSTRAINT "BarbershopUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BarbershopUser" ADD CONSTRAINT "BarbershopUser_barbershopId_fkey" FOREIGN KEY ("barbershopId") REFERENCES "Barbershop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_barbershopId_fkey" FOREIGN KEY ("barbershopId") REFERENCES "Barbershop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
