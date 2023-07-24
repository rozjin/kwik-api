-- AlterTable
ALTER TABLE "QRCode" ADD COLUMN     "expire" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Transfer" ADD COLUMN     "accepted" BOOLEAN NOT NULL DEFAULT false;
