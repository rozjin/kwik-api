/*
  Warnings:

  - Added the required column `last_balance` to the `Transfer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transfer" ADD COLUMN     "last_balance" DOUBLE PRECISION NOT NULL;
