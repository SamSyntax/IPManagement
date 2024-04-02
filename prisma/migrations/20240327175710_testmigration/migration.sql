/*
  Warnings:

  - You are about to drop the column `userId` on the `IPAddress` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[simsId]` on the table `IPAddress` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "IPAddress" DROP CONSTRAINT "IPAddress_userId_fkey";

-- DropIndex
DROP INDEX "IPAddress_userId_key";

-- AlterTable
ALTER TABLE "IPAddress" DROP COLUMN "userId",
ADD COLUMN     "simsId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "IPAddress_simsId_key" ON "IPAddress"("simsId");

-- AddForeignKey
ALTER TABLE "IPAddress" ADD CONSTRAINT "IPAddress_simsId_fkey" FOREIGN KEY ("simsId") REFERENCES "User"("simsId") ON DELETE SET NULL ON UPDATE CASCADE;
