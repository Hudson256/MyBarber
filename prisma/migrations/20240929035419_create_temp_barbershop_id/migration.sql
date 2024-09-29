-- CreateTable
CREATE TABLE "TempBarbershopId" (
    "id" SERIAL NOT NULL,
    "sessionId" TEXT NOT NULL,
    "barbershopId" TEXT NOT NULL,

    CONSTRAINT "TempBarbershopId_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TempBarbershopId_sessionId_key" ON "TempBarbershopId"("sessionId");
