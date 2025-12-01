/*
  Warnings:

  - You are about to drop the column `quantity` on the `BranchRoomType` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BranchRoomType" DROP COLUMN "quantity",
ALTER COLUMN "price" DROP NOT NULL;
