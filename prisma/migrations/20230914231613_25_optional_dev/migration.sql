-- DropForeignKey
ALTER TABLE "Transfer" DROP CONSTRAINT "Transfer_session_id_fkey";

-- AlterTable
ALTER TABLE "Transfer" ALTER COLUMN "session_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "StripeSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;
