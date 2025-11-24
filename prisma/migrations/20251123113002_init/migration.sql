/*
  Warnings:

  - You are about to drop the column `paymentId` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `capacity` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RoomStatus" AS ENUM ('AVAILABLE', 'OCCUPIED', 'MAINTENANCE');

-- DropIndex
DROP INDEX "Booking_paymentId_key";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "paymentId";

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "Roomstatus" "RoomStatus" NOT NULL DEFAULT 'AVAILABLE',
ADD COLUMN     "capacity" INTEGER NOT NULL;
