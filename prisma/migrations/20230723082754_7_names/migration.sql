/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `UserAuth` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `UserAuth` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "address" DROP NOT NULL;

-- AlterTable
ALTER TABLE "UserAuth" ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserAuth_name_key" ON "UserAuth"("name");
