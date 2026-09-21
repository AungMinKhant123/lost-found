/*
  Warnings:

  - A unique constraint covering the columns `[tokenLookup]` on the table `RefreshToken` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "RefreshToken" ADD COLUMN     "tokenLookup" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_tokenLookup_key" ON "RefreshToken"("tokenLookup");
