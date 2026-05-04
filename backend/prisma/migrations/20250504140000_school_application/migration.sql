-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "SchoolApplication" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "schoolName" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL DEFAULT '',
    "province" TEXT NOT NULL,
    "affiliation" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "coordinatorName" TEXT NOT NULL,
    "coordinatorEmail" TEXT NOT NULL,
    "coordinatorPhone" TEXT NOT NULL DEFAULT '',
    "message" TEXT NOT NULL DEFAULT '',
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "adminNote" TEXT NOT NULL DEFAULT '',
    "processedAt" TIMESTAMP(3),
    "processedById" TEXT,
    "schoolId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SchoolApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SchoolApplication_status_createdAt_idx" ON "SchoolApplication"("status", "createdAt");

-- CreateIndex
CREATE INDEX "SchoolApplication_coordinatorEmail_idx" ON "SchoolApplication"("coordinatorEmail");

-- AddForeignKey
ALTER TABLE "SchoolApplication" ADD CONSTRAINT "SchoolApplication_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE SET NULL ON UPDATE CASCADE;
