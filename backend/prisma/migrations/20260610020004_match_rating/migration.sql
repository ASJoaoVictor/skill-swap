-- CreateEnum
CREATE TYPE "RatingStatus" AS ENUM ('UP', 'DOWN');

-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "rating" "RatingStatus";
