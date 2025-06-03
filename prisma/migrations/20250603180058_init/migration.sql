-- CreateEnum
CREATE TYPE "Role" AS ENUM ('franchisee', 'franchisor', 'admin');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('pending', 'active', 'rejected');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "franchises" (
    "id" SERIAL NOT NULL,
    "franchisor_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "franchises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "franchise_applications" (
    "id" SERIAL NOT NULL,
    "franchise_id" INTEGER NOT NULL,
    "franchisee_id" INTEGER NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'pending',
    "notes" TEXT,
    "applied_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewed_at" TIMESTAMP(3),

    CONSTRAINT "franchise_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financial_reports" (
    "id" SERIAL NOT NULL,
    "franchisee_id" INTEGER NOT NULL,
    "franchise_id" INTEGER NOT NULL,
    "report_date" DATE NOT NULL,
    "file_url" TEXT NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "financial_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_resources" (
    "id" SERIAL NOT NULL,
    "id_franchise" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "resource_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "training_resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "event_date" DATE NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financial_assistance_requests" (
    "id" SERIAL NOT NULL,
    "franchisee_id" INTEGER NOT NULL,
    "franchise_id" INTEGER NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'pending',
    "notes" TEXT,
    "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewed_at" TIMESTAMP(3),

    CONSTRAINT "financial_assistance_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agreement_cancellation_requests" (
    "id" SERIAL NOT NULL,
    "franchisee_id" INTEGER NOT NULL,
    "franchise_id" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'pending',
    "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewed_at" TIMESTAMP(3),

    CONSTRAINT "agreement_cancellation_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "franchises_franchisor_id_idx" ON "franchises"("franchisor_id");

-- CreateIndex
CREATE INDEX "franchise_applications_franchise_id_idx" ON "franchise_applications"("franchise_id");

-- CreateIndex
CREATE INDEX "franchise_applications_franchisee_id_idx" ON "franchise_applications"("franchisee_id");

-- CreateIndex
CREATE INDEX "financial_reports_franchise_id_idx" ON "financial_reports"("franchise_id");

-- CreateIndex
CREATE INDEX "financial_reports_franchisee_id_idx" ON "financial_reports"("franchisee_id");

-- CreateIndex
CREATE INDEX "training_resources_id_franchise_idx" ON "training_resources"("id_franchise");

-- CreateIndex
CREATE INDEX "financial_assistance_requests_franchise_id_idx" ON "financial_assistance_requests"("franchise_id");

-- CreateIndex
CREATE INDEX "financial_assistance_requests_franchisee_id_idx" ON "financial_assistance_requests"("franchisee_id");

-- CreateIndex
CREATE INDEX "agreement_cancellation_requests_franchise_id_idx" ON "agreement_cancellation_requests"("franchise_id");

-- CreateIndex
CREATE INDEX "agreement_cancellation_requests_franchisee_id_idx" ON "agreement_cancellation_requests"("franchisee_id");

-- AddForeignKey
ALTER TABLE "franchises" ADD CONSTRAINT "franchises_franchisor_id_fkey" FOREIGN KEY ("franchisor_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "franchise_applications" ADD CONSTRAINT "franchise_applications_franchise_id_fkey" FOREIGN KEY ("franchise_id") REFERENCES "franchises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "franchise_applications" ADD CONSTRAINT "franchise_applications_franchisee_id_fkey" FOREIGN KEY ("franchisee_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_reports" ADD CONSTRAINT "financial_reports_franchisee_id_fkey" FOREIGN KEY ("franchisee_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_reports" ADD CONSTRAINT "financial_reports_franchise_id_fkey" FOREIGN KEY ("franchise_id") REFERENCES "franchises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_resources" ADD CONSTRAINT "training_resources_id_franchise_fkey" FOREIGN KEY ("id_franchise") REFERENCES "franchises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_assistance_requests" ADD CONSTRAINT "financial_assistance_requests_franchisee_id_fkey" FOREIGN KEY ("franchisee_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_assistance_requests" ADD CONSTRAINT "financial_assistance_requests_franchise_id_fkey" FOREIGN KEY ("franchise_id") REFERENCES "franchises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agreement_cancellation_requests" ADD CONSTRAINT "agreement_cancellation_requests_franchisee_id_fkey" FOREIGN KEY ("franchisee_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agreement_cancellation_requests" ADD CONSTRAINT "agreement_cancellation_requests_franchise_id_fkey" FOREIGN KEY ("franchise_id") REFERENCES "franchises"("id") ON DELETE CASCADE ON UPDATE CASCADE;
