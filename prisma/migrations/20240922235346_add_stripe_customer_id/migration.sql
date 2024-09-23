/*
  Warnings:

  - A unique constraint covering the columns `[stripeSessionId]` on the table `Barbershop` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "stripeCustomerId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Barbershop_stripeSessionId_key" ON "Barbershop"("stripeSessionId");
