/*
  Warnings:

  - Added the required column `confirmation_status` to the `franchise_listings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `confirmation_status` to the `funding_request` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "franchise_listings" ADD COLUMN     "confirmation_status" "ConfirmationStatus" NOT NULL;

-- AlterTable
ALTER TABLE "funding_request" ADD COLUMN     "confirmation_status" "ConfirmationStatus" NOT NULL;
