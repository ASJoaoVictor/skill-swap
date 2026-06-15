/*
  Warnings:

  - You are about to drop the column `rating` on the `Match` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Match" DROP COLUMN "rating",
ADD COLUMN     "ratingReceiver" "RatingStatus",
ADD COLUMN     "ratingRequester" "RatingStatus";
