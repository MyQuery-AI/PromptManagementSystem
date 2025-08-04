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
CREATE UNIQUE INDEX "prompt_types_name_key" ON "public"."prompt_types"("name");
