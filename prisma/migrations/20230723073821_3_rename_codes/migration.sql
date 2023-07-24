/*
  Warnings:

  - You are about to drop the `QRCode` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "QRCode" DROP CONSTRAINT "QRCode_user_id_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL;

-- DropTable
DROP TABLE "QRCode";

-- CreateTable
CREATE TABLE "TransferCode" (
    "id" SERIAL NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "expire" TIMESTAMP(3),
    "desc" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "TransferCode_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TransferCode" ADD CONSTRAINT "TransferCode_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
