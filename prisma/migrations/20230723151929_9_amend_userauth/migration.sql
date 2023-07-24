/*
  Warnings:

  - You are about to drop the column `extra` on the `UserAuth` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `UserAuth` table. All the data in the column will be lost.
  - Added the required column `password` to the `UserAuth` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refreshToken` to the `UserAuth` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserAuth" DROP COLUMN "extra",
DROP COLUMN "name",
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "refreshToken" TEXT NOT NULL;
