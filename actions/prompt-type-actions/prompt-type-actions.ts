"use server";

import { PrismaClient } from "@/app/generated/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import type {
  CreatePromptTypeInput,
  UpdatePromptTypeInput,
  PromptTypeResponse,
  ActionResponse,
} from "./types";

const prisma = new PrismaClient();

export async function createPromptType(
  input: CreatePromptTypeInput
): Promise<ActionResponse<PromptTypeResponse>> {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return {
        success: false,
        error: "Authentication required",
      };
    }

    // Check if user has permission to create prompt types
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true },
    });

    if (!user || (user.role !== "Owner" && user.role !== "Admin")) {
      return {
        success: false,
        error: "Insufficient permissions to create prompt types",
      };
    }

    // Check if prompt type name already exists
    const existingPromptType = await prisma.promptType.findUnique({
      where: { name: input.name },
    });

    if (existingPromptType) {
      return {
        success: false,
        error: "A prompt type with this name already exists",
      };
    }

    // Create the prompt type
    const promptType = await prisma.promptType.create({
      data: {
        name: input.name,
        usage: input.usage,
        color: input.color,
        bgColor: input.bgColor,
        textColor: input.textColor,
        icon: input.icon,
      },
    });

    revalidatePath("/prompt-types");

    return {
      success: true,
      data: promptType,
      message: "Prompt type created successfully",
    };
  } catch (error) {
    console.error("Error creating prompt type:", error);
    return {
      success: false,
      error: "Failed to create prompt type",
    };
  }
}

export async function updatePromptType(
  input: UpdatePromptTypeInput
): Promise<ActionResponse<PromptTypeResponse>> {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return {
        success: false,
        error: "Authentication required",
      };
    }

    // Check if user has permission to update prompt types
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true },
    });

    if (!user || (user.role !== "Owner" && user.role !== "Admin")) {
      return {
        success: false,
        error: "Insufficient permissions to update prompt types",
      };
    }

    // Check if prompt type exists
    const existingPromptType = await prisma.promptType.findUnique({
      where: { id: input.id },
    });

    if (!existingPromptType) {
      return {
        success: false,
        error: "Prompt type not found",
      };
    }

    // Check if name conflicts with another prompt type
    if (input.name !== existingPromptType.name) {
      const nameConflict = await prisma.promptType.findUnique({
        where: { name: input.name },
      });

      if (nameConflict) {
        return {
          success: false,
          error: "A prompt type with this name already exists",
        };
      }
    }

    // Update the prompt type
    const promptType = await prisma.promptType.update({
      where: { id: input.id },
      data: {
        name: input.name,
        usage: input.usage,
        color: input.color,
        bgColor: input.bgColor,
        textColor: input.textColor,
        icon: input.icon,
      },
    });

    revalidatePath("/prompt-types");

    return {
      success: true,
      data: promptType,
      message: "Prompt type updated successfully",
    };
  } catch (error) {
    console.error("Error updating prompt type:", error);
    return {
      success: false,
      error: "Failed to update prompt type",
    };
  }
}

export async function deletePromptType(id: string): Promise<ActionResponse> {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return {
        success: false,
        error: "Authentication required",
      };
    }

    // Check if user has permission to delete prompt types
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true },
    });

    if (!user || (user.role !== "Owner" && user.role !== "Admin")) {
      return {
        success: false,
        error: "Insufficient permissions to delete prompt types",
      };
    }

    // Check if prompt type exists
    const existingPromptType = await prisma.promptType.findUnique({
      where: { id },
    });

    if (!existingPromptType) {
      return {
        success: false,
        error: "Prompt type not found",
      };
    }

    // Check if any prompts are using this type
    const promptsUsingType = await prisma.prompt.findFirst({
      where: { promptTypeId: id },
    });

    if (promptsUsingType) {
      return {
        success: false,
        error:
          "Cannot delete prompt type that is being used by existing prompts",
      };
    }

    // Delete the prompt type
    await prisma.promptType.delete({
      where: { id },
    });

    revalidatePath("/prompt-types");

    return {
      success: true,
      message: "Prompt type deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting prompt type:", error);
    return {
      success: false,
      error: "Failed to delete prompt type",
    };
  }
}

export async function getAllPromptTypes(): Promise<
  ActionResponse<PromptTypeResponse[]>
> {
  try {
    const promptTypes = await prisma.promptType.findMany({
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      data: promptTypes,
    };
  } catch (error) {
    console.error("Error fetching prompt types:", error);
    return {
      success: false,
      error: "Failed to fetch prompt types",
    };
  }
}

export async function getPromptTypeById(
  id: string
): Promise<PromptTypeResponse | null> {
  try {
    const promptType = await prisma.promptType.findUnique({
      where: { id },
    });

    return promptType;
  } catch (error) {
    console.error("Error fetching prompt type by ID:", error);
    return null;
  }
}

export async function getAllPromptTypesWithCounts(): Promise<
  ActionResponse<(PromptTypeResponse & { _count: { prompts: number } })[]>
> {
  try {
    const promptTypes = await prisma.promptType.findMany({
      include: {
        _count: {
          select: { prompts: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      data: promptTypes,
    };
  } catch (error) {
    console.error("Error fetching prompt types with counts:", error);
    return {
      success: false,
      error: "Failed to fetch prompt types",
    };
  }
}
