-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('draft', 'submitted', 'scoring', 'manual_review', 'approved', 'rejected', 'disbursed', 'active', 'closed', 'defaulted');

-- CreateEnum
CREATE TYPE "LoanStatus" AS ENUM ('active', 'closed', 'defaulted');

-- CreateEnum
CREATE TYPE "InstallmentStatus" AS ENUM ('pending', 'paid', 'overdue');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'succeeded', 'failed');

-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('stripe', 'mock');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('sa_id', 'proof_of_income');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('pending', 'verified', 'rejected');

-- CreateTable
CREATE TABLE "loan_product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "minAmountCents" INTEGER NOT NULL,
    "maxAmountCents" INTEGER NOT NULL,
    "minTermMonths" INTEGER NOT NULL,
    "maxTermMonths" INTEGER NOT NULL,
    "monthlyInterestBps" INTEGER NOT NULL,
    "initiationFeeBps" INTEGER NOT NULL,
    "monthlyServiceFeeCents" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "loan_product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loan_application" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'draft',
    "amountCents" INTEGER NOT NULL,
    "termMonths" INTEGER NOT NULL,
    "idNumber" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "incomeCents" INTEGER,
    "expensesCents" INTEGER,
    "employer" TEXT,
    "score" INTEGER,
    "decisionReason" TEXT,
    "reviewedById" TEXT,
    "submittedAt" TIMESTAMP(3),
    "decidedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "loan_application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loan" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "LoanStatus" NOT NULL DEFAULT 'active',
    "principalCents" INTEGER NOT NULL,
    "monthlyInterestBps" INTEGER NOT NULL,
    "termMonths" INTEGER NOT NULL,
    "disbursedAt" TIMESTAMP(3) NOT NULL,
    "closedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "loan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "installment" (
    "id" TEXT NOT NULL,
    "loanId" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "principalCents" INTEGER NOT NULL,
    "interestCents" INTEGER NOT NULL,
    "feeCents" INTEGER NOT NULL,
    "status" "InstallmentStatus" NOT NULL DEFAULT 'pending',
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "installment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment" (
    "id" TEXT NOT NULL,
    "loanId" TEXT NOT NULL,
    "installmentId" TEXT,
    "provider" "PaymentProvider" NOT NULL,
    "providerPaymentId" TEXT,
    "status" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "amountCents" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "applicationId" TEXT,
    "type" "DocumentType" NOT NULL,
    "status" "DocumentStatus" NOT NULL DEFAULT 'pending',
    "s3Key" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "reviewedById" TEXT,
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_log" (
    "id" TEXT NOT NULL,
    "actorId" TEXT,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "fromStatus" TEXT,
    "toStatus" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "loan_application_userId_idx" ON "loan_application"("userId");

-- CreateIndex
CREATE INDEX "loan_application_status_submittedAt_idx" ON "loan_application"("status", "submittedAt");

-- CreateIndex
CREATE UNIQUE INDEX "loan_applicationId_key" ON "loan"("applicationId");

-- CreateIndex
CREATE INDEX "loan_userId_idx" ON "loan"("userId");

-- CreateIndex
CREATE INDEX "loan_status_idx" ON "loan"("status");

-- CreateIndex
CREATE INDEX "installment_status_dueDate_idx" ON "installment"("status", "dueDate");

-- CreateIndex
CREATE UNIQUE INDEX "installment_loanId_sequence_key" ON "installment"("loanId", "sequence");

-- CreateIndex
CREATE UNIQUE INDEX "payment_providerPaymentId_key" ON "payment"("providerPaymentId");

-- CreateIndex
CREATE INDEX "payment_loanId_idx" ON "payment"("loanId");

-- CreateIndex
CREATE INDEX "payment_installmentId_idx" ON "payment"("installmentId");

-- CreateIndex
CREATE INDEX "document_userId_idx" ON "document"("userId");

-- CreateIndex
CREATE INDEX "document_applicationId_idx" ON "document"("applicationId");

-- CreateIndex
CREATE INDEX "document_status_idx" ON "document"("status");

-- CreateIndex
CREATE INDEX "audit_log_entityType_entityId_idx" ON "audit_log"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "audit_log_actorId_idx" ON "audit_log"("actorId");

-- AddForeignKey
ALTER TABLE "loan_application" ADD CONSTRAINT "loan_application_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_application" ADD CONSTRAINT "loan_application_productId_fkey" FOREIGN KEY ("productId") REFERENCES "loan_product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan" ADD CONSTRAINT "loan_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "loan_application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan" ADD CONSTRAINT "loan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "installment" ADD CONSTRAINT "installment_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "loan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "loan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_installmentId_fkey" FOREIGN KEY ("installmentId") REFERENCES "installment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document" ADD CONSTRAINT "document_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document" ADD CONSTRAINT "document_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "loan_application"("id") ON DELETE SET NULL ON UPDATE CASCADE;
