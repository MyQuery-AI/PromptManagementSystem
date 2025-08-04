/*
  Warnings:

  - Added the required column `feature` to the `prompts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."prompts" ADD COLUMN     "feature" TEXT NOT NULL;
