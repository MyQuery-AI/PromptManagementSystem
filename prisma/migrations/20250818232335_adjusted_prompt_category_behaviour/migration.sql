/*
  Warnings:

  - You are about to drop the column `promptCategoryId` on the `prompts` table. All the data in the column will be lost.
  - You are about to drop the `PromptCategory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `promptCategory` to the `prompts` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."PromptCategoryNames" AS ENUM ('SQL_GENERATION', 'DASHBOARD_GENERATION', 'HYBRID_GENERATION', 'GENERAL');

-- DropForeignKey
ALTER TABLE "public"."prompts" DROP CONSTRAINT "prompts_promptCategoryId_fkey";

-- AlterTable
ALTER TABLE "public"."prompts" DROP COLUMN "promptCategoryId",
ADD COLUMN     "promptCategory" "public"."PromptCategoryNames" NOT NULL;

-- DropTable
DROP TABLE "public"."PromptCategory";
