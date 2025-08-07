/*
  Warnings:

  - The `role` column on the `Participant` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."Participant" DROP COLUMN "role",
ADD COLUMN     "role" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- DropEnum
DROP TYPE "public"."Role";
