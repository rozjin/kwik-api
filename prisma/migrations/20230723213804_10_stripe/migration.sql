-- AlterTable
ALTER TABLE "User" ADD COLUMN     "stripe_id" TEXT,
ADD COLUMN     "stripe_verified" BOOLEAN NOT NULL DEFAULT false;
