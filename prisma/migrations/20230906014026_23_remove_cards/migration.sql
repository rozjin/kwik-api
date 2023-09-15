/*
  Warnings:

  - You are about to drop the `StripeCard` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "StripeCard" DROP CONSTRAINT "StripeCard_user_id_fkey";

-- DropTable
DROP TABLE "StripeCard";

-- DropEnum
DROP TYPE "StripeCardStatus";
