/*
  Warnings:

  - A unique constraint covering the columns `[address]` on the table `IPAddress` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ip]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ipAddressId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ip` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "ip" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "IPAddress_address_key" ON "IPAddress"("address");

-- CreateIndex
CREATE UNIQUE INDEX "User_ip_key" ON "User"("ip");

-- CreateIndex
CREATE UNIQUE INDEX "User_ipAddressId_key" ON "User"("ipAddressId");
