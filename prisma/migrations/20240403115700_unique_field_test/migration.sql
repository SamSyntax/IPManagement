/*
  Warnings:

  - A unique constraint covering the columns `[ipAddressId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_ip_key";

-- CreateIndex
CREATE UNIQUE INDEX "User_ipAddressId_key" ON "User"("ipAddressId");
