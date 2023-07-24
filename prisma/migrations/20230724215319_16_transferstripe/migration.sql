/*
  Warnings:

  - Added the required column `stripe_id` to the `Transfer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transfer" ADD COLUMN     "stripe_id" TEXT NOT NULL;
