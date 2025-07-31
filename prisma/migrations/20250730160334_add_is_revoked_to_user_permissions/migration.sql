-- AlterTable
ALTER TABLE "public"."user_permissions" ADD COLUMN     "isRevoked" BOOLEAN NOT NULL DEFAULT false;
