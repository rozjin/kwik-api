/*
  Warnings:

  - Added the required column `status` to the `StripeCard` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StripeCardStatus" AS ENUM ('INIT', 'WAIT', 'SUCCESS', 'FAILED');

-- AlterTable
ALTER TABLE "StripeCard" ADD COLUMN     "status" "StripeCardStatus" NOT NULL,
ADD COLUMN     "status_reason" TEXT;

-- AlterTable
ALTER TABLE "StripeSession" ADD COLUMN     "status_reason" TEXT;
