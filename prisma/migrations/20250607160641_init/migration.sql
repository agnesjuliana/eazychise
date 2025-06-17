-- CreateEnum
CREATE TYPE "Status" AS ENUM ('WAITING', 'REJECTED', 'ACCEPTED');

-- CreateEnum
CREATE TYPE "PurchaseType" AS ENUM ('FUNDED', 'PURCHASED');

-- CreateEnum
CREATE TYPE "ConfirmationStatus" AS ENUM ('REJECTED', 'WAITING', 'ACCEPTED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PAID', 'PROCESSED');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('PENDUKUNG', 'GUIDELINES');

-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('FRANCHISEE', 'FRANCHISOR', 'ADMIN');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "status" "Status" NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profile_image" TEXT,
    "role" "Roles" NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "franchise_purchases" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "franchise_id" UUID NOT NULL,
    "purchase_type" "PurchaseType" NOT NULL,
    "confirmation_status" "ConfirmationStatus" NOT NULL,
    "payment_status" "PaymentStatus" NOT NULL,
    "paid_at" TIMESTAMP(3),

    CONSTRAINT "franchise_purchases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "funding_request" (
    "id" UUID NOT NULL,
    "purchase_id" UUID NOT NULL,
    "address" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "npwp" TEXT NOT NULL,
    "franchise_address" TEXT NOT NULL,
    "ktp" TEXT NOT NULL,
    "foto_diri" TEXT NOT NULL,
    "foto_lokasi" TEXT NOT NULL,
    "mou_franchisor" TEXT NOT NULL,
    "mou_modal" TEXT NOT NULL,

    CONSTRAINT "funding_request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "franchisor_profiles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "ktp" TEXT NOT NULL,
    "foto_diri" TEXT NOT NULL,

    CONSTRAINT "franchisor_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "franchise_listings" (
    "id" UUID NOT NULL,
    "franchisor_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "image" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "ownership_document" TEXT NOT NULL,
    "financial_statement" TEXT NOT NULL,
    "proposal" TEXT NOT NULL,
    "sales_location" TEXT NOT NULL,
    "equipment" TEXT NOT NULL,
    "materials" TEXT NOT NULL,

    CONSTRAINT "franchise_listings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listing_documents" (
    "id" UUID NOT NULL,
    "id_franchise" UUID NOT NULL,
    "type" "DocumentType" NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,

    CONSTRAINT "listing_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_notifications" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL,
    "sent_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listings_highlights" (
    "id" UUID NOT NULL,
    "id_franchise" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "listings_highlights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "datetime" TIMESTAMP(3) NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "funding_request_purchase_id_key" ON "funding_request"("purchase_id");

-- CreateIndex
CREATE UNIQUE INDEX "franchisor_profiles_user_id_key" ON "franchisor_profiles"("user_id");

-- AddForeignKey
ALTER TABLE "franchise_purchases" ADD CONSTRAINT "franchise_purchases_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "franchise_purchases" ADD CONSTRAINT "franchise_purchases_franchise_id_fkey" FOREIGN KEY ("franchise_id") REFERENCES "franchise_listings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "funding_request" ADD CONSTRAINT "funding_request_purchase_id_fkey" FOREIGN KEY ("purchase_id") REFERENCES "franchise_purchases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "franchisor_profiles" ADD CONSTRAINT "franchisor_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "franchise_listings" ADD CONSTRAINT "franchise_listings_franchisor_id_fkey" FOREIGN KEY ("franchisor_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listing_documents" ADD CONSTRAINT "listing_documents_id_franchise_fkey" FOREIGN KEY ("id_franchise") REFERENCES "franchise_listings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_notifications" ADD CONSTRAINT "user_notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listings_highlights" ADD CONSTRAINT "listings_highlights_id_franchise_fkey" FOREIGN KEY ("id_franchise") REFERENCES "franchise_listings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
