-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('Owner', 'Admin', 'Developer');

-- CreateEnum
CREATE TYPE "public"."Permission" AS ENUM ('MANAGE_USERS', 'MANAGE_USER_ROLES', 'VIEW_PROMPTS', 'CREATE_PROMPTS', 'EDIT_PROMPTS', 'DELETE_PROMPTS', 'MANAGE_SYSTEM');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "otp" TEXT,
    "otpId" TEXT,
    "otpExpiresAt" TIMESTAMP(3),
    "role" "public"."Role" NOT NULL DEFAULT 'Developer',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_permissions" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "permission" "public"."Permission" NOT NULL,
    "isRevoked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."prompts" (
    "id" SERIAL NOT NULL,
    "feature" TEXT NOT NULL,
    "promptTypeId" TEXT NOT NULL,
    "version" TEXT NOT NULL DEFAULT 'v1',
    "content" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prompts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."prompt_types" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "color" TEXT NOT NULL DEFAULT 'gray',
    "bgColor" TEXT NOT NULL DEFAULT 'bg-gray-100',
    "textColor" TEXT NOT NULL DEFAULT 'text-gray-800',
    "usage" TEXT NOT NULL DEFAULT 'General Use',
    "icon" TEXT DEFAULT '📝',

    CONSTRAINT "prompt_types_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_otpId_key" ON "public"."users"("otpId");

-- CreateIndex
CREATE UNIQUE INDEX "user_permissions_userId_permission_key" ON "public"."user_permissions"("userId", "permission");

-- CreateIndex
CREATE UNIQUE INDEX "prompt_types_name_key" ON "public"."prompt_types"("name");

-- AddForeignKey
ALTER TABLE "public"."user_permissions" ADD CONSTRAINT "user_permissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."prompts" ADD CONSTRAINT "prompts_promptTypeId_fkey" FOREIGN KEY ("promptTypeId") REFERENCES "public"."prompt_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;
