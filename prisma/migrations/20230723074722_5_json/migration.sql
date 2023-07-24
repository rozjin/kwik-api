/*
  Warnings:

  - Changed the type of `extra` on the `UserAuth` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "UserAuth" DROP COLUMN "extra",
ADD COLUMN     "extra" JSONB NOT NULL;
