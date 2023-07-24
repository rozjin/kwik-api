/*
  Warnings:

  - A unique constraint covering the columns `[refreshToken]` on the table `UserAuth` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "UserAuth" ALTER COLUMN "refreshToken" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserAuth_refreshToken_key" ON "UserAuth"("refreshToken");
