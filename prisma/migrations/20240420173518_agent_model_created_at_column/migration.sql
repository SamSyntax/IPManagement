-- CreateEnum
CREATE TYPE "Role" AS ENUM ('AGENT', 'ADMIN');

-- AlterTable
ALTER TABLE "IPAddress" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "Agent" (
    "id" SERIAL NOT NULL,
    "simsId" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'AGENT',

    CONSTRAINT "Agent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Agent_simsId_key" ON "Agent"("simsId");
