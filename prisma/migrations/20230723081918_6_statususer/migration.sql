/*
  Warnings:

  - Made the column `blocked` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `paused` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "blocked" SET NOT NULL,
ALTER COLUMN "paused" SET NOT NULL;
