/*
  Warnings:

  - You are about to drop the column `promptType` on the `prompts` table. All the data in the column will be lost.
  - Added the required column `promptTypeId` to the `prompts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."prompts" DROP COLUMN "promptType",
ADD COLUMN     "promptTypeId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."prompts" ADD CONSTRAINT "prompts_promptTypeId_fkey" FOREIGN KEY ("promptTypeId") REFERENCES "public"."prompt_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;
