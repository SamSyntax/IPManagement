-- DropForeignKey
ALTER TABLE "Action" DROP CONSTRAINT "Action_addressId_fkey";

-- DropForeignKey
ALTER TABLE "Action" DROP CONSTRAINT "Action_userId_fkey";

-- AlterTable
ALTER TABLE "Action" ALTER COLUMN "addressId" DROP NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "IPAddress"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
