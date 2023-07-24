/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `UserAuth` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserAuth_user_id_key" ON "UserAuth"("user_id");
