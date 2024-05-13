-- DropForeignKey
ALTER TABLE "Action" DROP CONSTRAINT "Action_agentId_fkey";

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
