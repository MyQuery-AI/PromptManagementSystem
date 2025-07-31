-- AlterTable
ALTER TABLE "public"."prompts" ADD COLUMN     "promptType" TEXT NOT NULL DEFAULT 'sql_generation';
