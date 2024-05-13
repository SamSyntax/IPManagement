/*
  Warnings:

  - The `actionType` column on the `Action` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('MODIFY', 'CREATE', 'DELETE', 'ADD_ADDRESS');

-- AlterTable
ALTER TABLE "Action" ADD COLUMN     "message" TEXT NOT NULL DEFAULT 'Message wasn''t provided.',
DROP COLUMN "actionType",
ADD COLUMN     "actionType" "ActionType" NOT NULL DEFAULT 'MODIFY';
