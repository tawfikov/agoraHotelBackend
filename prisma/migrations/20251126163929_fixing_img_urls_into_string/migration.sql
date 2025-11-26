/*
  Warnings:

  - You are about to drop the column `imgUrl` on the `Branch` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Branch" DROP COLUMN "imgUrl",
ADD COLUMN     "imgUrls" TEXT[] DEFAULT ARRAY[]::TEXT[];
