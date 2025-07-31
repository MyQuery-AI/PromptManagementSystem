/*
  Warnings:

  - You are about to drop the column `confirmPassword` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[otpId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('Owner', 'Admin', 'Developer');

-- CreateEnum
CREATE TYPE "public"."Permission" AS ENUM ('MANAGE_USERS', 'MANAGE_USER_ROLES', 'VIEW_PROMPTS', 'CREATE_PROMPTS', 'EDIT_PROMPTS', 'DELETE_PROMPTS', 'MANAGE_SYSTEM');

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "confirmPassword",
ADD COLUMN     "otpId" TEXT,
ADD COLUMN     "role" "public"."Role" NOT NULL DEFAULT 'Developer';

-- CreateTable
CREATE TABLE "public"."user_permissions" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "permission" "public"."Permission" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_permissions_userId_permission_key" ON "public"."user_permissions"("userId", "permission");

-- CreateIndex
CREATE UNIQUE INDEX "users_otpId_key" ON "public"."users"("otpId");

-- AddForeignKey
ALTER TABLE "public"."user_permissions" ADD CONSTRAINT "user_permissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
