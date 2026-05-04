-- AlterTable: extend School with profile fields
ALTER TABLE "School" ADD COLUMN "bannerUrl" TEXT;
ALTER TABLE "School" ADD COLUMN "description" TEXT NOT NULL DEFAULT '';
ALTER TABLE "School" ADD COLUMN "address" TEXT NOT NULL DEFAULT '';
ALTER TABLE "School" ADD COLUMN "phone" TEXT NOT NULL DEFAULT '';
ALTER TABLE "School" ADD COLUMN "facebookUrl" TEXT NOT NULL DEFAULT '';
ALTER TABLE "School" ADD COLUMN "lineId" TEXT NOT NULL DEFAULT '';

-- CreateTable: gallery images (Smart Classroom activity gallery, max 5 enforced in service)
CREATE TABLE "SchoolGalleryImage" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "schoolId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT NOT NULL DEFAULT '',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SchoolGalleryImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SchoolGalleryImage_schoolId_sortOrder_idx" ON "SchoolGalleryImage"("schoolId", "sortOrder");

-- AddForeignKey
ALTER TABLE "SchoolGalleryImage" ADD CONSTRAINT "SchoolGalleryImage_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable: certificate / trophy gallery (image or PDF)
CREATE TABLE "SchoolCertificate" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "schoolId" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "fileUrl" TEXT NOT NULL,
    "fileType" TEXT NOT NULL DEFAULT 'image',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SchoolCertificate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SchoolCertificate_schoolId_createdAt_idx" ON "SchoolCertificate"("schoolId", "createdAt");

-- AddForeignKey
ALTER TABLE "SchoolCertificate" ADD CONSTRAINT "SchoolCertificate_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;
