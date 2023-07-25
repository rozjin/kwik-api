/*
  Warnings:

  - A unique constraint covering the columns `[stripe_id]` on the table `Transfer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Transfer_stripe_id_key" ON "Transfer"("stripe_id");
