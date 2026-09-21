/*
  Warnings:

  - You are about to drop the column `facebookUsername` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `instagramUsername` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lineUsername` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "facebookUsername",
DROP COLUMN "instagramUsername",
DROP COLUMN "lineUsername",
ADD COLUMN     "socialMedia" TEXT;
