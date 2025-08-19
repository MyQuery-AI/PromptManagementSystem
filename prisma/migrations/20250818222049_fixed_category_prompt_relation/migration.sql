/*
  Warnings:

  - The primary key for the `PromptCategory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `categoryId` on the `prompts` table. All the data in the column will be lost.
  - Added the required column `promptCategoryId` to the `prompts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."prompts" DROP CONSTRAINT "prompts_categoryId_fkey";

-- AlterTable
ALTER TABLE "public"."PromptCategory" DROP CONSTRAINT "PromptCategory_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "PromptCategory_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "PromptCategory_id_seq";

-- AlterTable
ALTER TABLE "public"."prompts" DROP COLUMN "categoryId",
ADD COLUMN     "promptCategoryId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."prompts" ADD CONSTRAINT "prompts_promptCategoryId_fkey" FOREIGN KEY ("promptCategoryId") REFERENCES "public"."PromptCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
