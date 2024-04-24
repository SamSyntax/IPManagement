/*
  Warnings:

  - You are about to drop the column `addressId` on the `Action` table. All the data in the column will be lost.
  - Changed the type of `actionType` on the `Action` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('CREATE_USER', 'UPDATE_USER', 'DELETE_USER', 'CREATE_IP_ADDRESS', 'UPDATE_IP_ADDRESS', 'DELETE_IP_ADDRESS');

-- DropForeignKey
ALTER TABLE "Action" DROP CONSTRAINT "Action_addressId_fkey";

-- DropForeignKey
ALTER TABLE "Action" DROP CONSTRAINT "Action_userId_fkey";

-- DropIndex
DROP INDEX "User_ipAddressId_key";

-- AlterTable
ALTER TABLE "Action" DROP COLUMN "addressId",
ADD COLUMN     "ipAddressId" TEXT,
ALTER COLUMN "userId" DROP NOT NULL,
DROP COLUMN "actionType",
ADD COLUMN     "actionType" "ActionType" NOT NULL;

-- CreateIndex
CREATE INDEX "Action_agentId_idx" ON "Action"("agentId");

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_ipAddressId_fkey" FOREIGN KEY ("ipAddressId") REFERENCES "IPAddress"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
