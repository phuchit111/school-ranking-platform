-- School.nameKey: unique normalized name; dedupe existing rows by suffixing id
ALTER TABLE "School" ADD COLUMN IF NOT EXISTS "nameKey" TEXT;

UPDATE "School"
SET "nameKey" = lower(trim(both from regexp_replace(coalesce("name", ''), '\s+', ' ', 'g')));

UPDATE "School" s
SET "nameKey" = s."nameKey" || '-' || s."id"::text
WHERE s."id" IN (
  SELECT id
  FROM (
    SELECT id,
           ROW_NUMBER() OVER (
             PARTITION BY "nameKey"
             ORDER BY "createdAt" ASC, id ASC
           ) AS rn
    FROM "School"
  ) x
  WHERE rn > 1
);

ALTER TABLE "School" ALTER COLUMN "nameKey" SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "School_nameKey_key" ON "School"("nameKey");

-- Audit trail
CREATE TABLE IF NOT EXISTS "AuditLog" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "actorId" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT,
    "entityId" TEXT,
    "meta" JSONB,
    "ip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");
CREATE INDEX IF NOT EXISTS "AuditLog_actorId_idx" ON "AuditLog"("actorId");

-- Password reset (token stored as SHA-256 hex)
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "passwordResetToken" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "passwordResetExpires" TIMESTAMP(3);

CREATE UNIQUE INDEX IF NOT EXISTS "User_passwordResetToken_key" ON "User"("passwordResetToken");
