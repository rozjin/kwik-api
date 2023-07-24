/*
  Warnings:

  - You are about to drop the column `stripe_id` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "stripe_id",
ADD COLUMN     "stripe_connect_id" TEXT,
ADD COLUMN     "stripe_customer_id" TEXT;
