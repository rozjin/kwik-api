/*
  Warnings:

  - You are about to drop the column `accepted` on the `Transfer` table. All the data in the column will be lost.
  - Added the required column `session_id` to the `Transfer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Transfer` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StripeSessionStatus" AS ENUM ('WAITING', 'FAILED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "TransferStatus" AS ENUM ('INIT', 'CHARGING', 'SUCCESS', 'FAILED');

-- AlterTable
ALTER TABLE "Transfer" DROP COLUMN "accepted",
ADD COLUMN     "session_id" INTEGER NOT NULL,
ADD COLUMN     "status" "TransferStatus" NOT NULL,
ADD COLUMN     "status_reason" TEXT;

-- CreateTable
CREATE TABLE "StripeCard" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "stripe_id" TEXT NOT NULL,

    CONSTRAINT "StripeCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StripeSession" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "status" "StripeSessionStatus" NOT NULL,
    "stripe_id" TEXT NOT NULL,

    CONSTRAINT "StripeSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StripeCard_stripe_id_key" ON "StripeCard"("stripe_id");

-- CreateIndex
CREATE UNIQUE INDEX "StripeSession_stripe_id_key" ON "StripeSession"("stripe_id");

-- AddForeignKey
ALTER TABLE "StripeCard" ADD CONSTRAINT "StripeCard_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StripeSession" ADD CONSTRAINT "StripeSession_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "StripeSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
