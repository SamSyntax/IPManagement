-- CreateEnum
CREATE TYPE "Type" AS ENUM ('P4', 'P6');

-- CreateEnum
CREATE TYPE "Region" AS ENUM ('EMEA', 'APAC', 'AMERICAS');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "simsId" VARCHAR(8) NOT NULL,
    "ipAdressId" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IPAddress" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "type" "Type" NOT NULL DEFAULT 'P4',
    "region" "Region" NOT NULL DEFAULT 'EMEA',
    "isTaken" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT,

    CONSTRAINT "IPAddress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_simsId_key" ON "User"("simsId");

-- CreateIndex
CREATE UNIQUE INDEX "IPAddress_userId_key" ON "IPAddress"("userId");

-- AddForeignKey
ALTER TABLE "IPAddress" ADD CONSTRAINT "IPAddress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("simsId") ON DELETE SET NULL ON UPDATE CASCADE;
