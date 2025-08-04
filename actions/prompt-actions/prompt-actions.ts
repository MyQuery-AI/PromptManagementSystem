"use server";

import { revalidatePath } from "next/cache";
import { PrismaClient } from "@/app/generated/prisma";
import { auth } from "@/auth";
import { hasPermission } from "@/actions/user-actions/permissions";
import { PERMISSIONS } from "@/lib/permissions-config";
import type {
  CreatePromptInput,
  UpdatePromptInput,
  PromptFilters,
  PromptResponse,
  PromptActionResult,
} from "./types";

const prisma = new PrismaClient();

/**
 * Get all prompts with optional filtering
 */
export async function getPrompts(
  filters?: PromptFilters
): Promise<PromptActionResult<PromptResponse[]>> {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Authentication required. Please sign in to view prompts.",
      };
    }

    // Check permission
    const canView = await hasPermission(
      session.user.id,
      PERMISSIONS.VIEW_PROMPTS
    );
    if (!canView) {
      return {
        success: false,
        error:
          "You don't have permission to view prompts. Please contact your system administrator to request access.",
      };
    }

    const where: any = {};

    if (filters?.search) {
      where.OR = [
        { content: { contains: filters.search, mode: "insensitive" } },
        { createdBy: { contains: filters.search, mode: "insensitive" } },
        {
          promptType: {
            name: { contains: filters.search, mode: "insensitive" },
          },
        },
      ];
    }

    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters?.promptTypeId) {
      where.promptTypeId = filters.promptTypeId;
    }

    if (filters?.createdBy) {
      where.createdBy = filters.createdBy;
    }

    const prompts = await prisma.prompt.findMany({
      where,
      include: { promptType: true },
      orderBy: { updatedAt: "desc" },
    });

    return {
      success: true,
      data: prompts,
    };
  } catch (error) {
    console.error("Error fetching prompts:", error);
    return {
      success: false,
      error: "Failed to fetch prompts",
    };
  }
}

/**
 * Get a single prompt by ID
 */
export async function getPromptById(
  id: number
): Promise<PromptActionResult<PromptResponse>> {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Authentication required. Please sign in to view prompts.",
      };
    }

    // Check permission
    const canView = await hasPermission(
      session.user.id,
      PERMISSIONS.VIEW_PROMPTS
    );
    if (!canView) {
      return {
        success: false,
        error:
          "You don't have permission to view prompts. Please contact your system administrator to request access.",
      };
    }

    const prompt = await prisma.prompt.findUnique({
      where: { id },
      include: { promptType: true },
    });

    if (!prompt) {
      return {
        success: false,
        error: "Prompt not found",
      };
    }

    return {
      success: true,
      data: prompt,
    };
  } catch (error) {
    console.error("Error fetching prompt:", error);
    return {
      success: false,
      error: "Failed to fetch prompt",
    };
  }
}

/**
 * Create a new prompt
 */
export async function createPrompt(
  input: CreatePromptInput
): Promise<PromptActionResult<PromptResponse>> {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Authentication required. Please sign in to create prompts.",
      };
    }

    // Check permission
    const canCreate = await hasPermission(
      session.user.id,
      PERMISSIONS.CREATE_PROMPTS
    );
    if (!canCreate) {
      return {
        success: false,
        error:
          "You don't have permission to create prompts. Please contact your system administrator to request 'Create Prompts' permission.",
      };
    }

    const prompt = await prisma.prompt.create({
      data: {
        promptTypeId: input.promptTypeId,
        version: input.version || "v1",
        content: input.content,
        isActive: input.isActive ?? true,
        createdBy: input.createdBy,
      },
      include: { promptType: true },
    });

    revalidatePath("/prompts");

    return {
      success: true,
      data: prompt,
      message: "Prompt created successfully",
    };
  } catch (error) {
    console.error("Error creating prompt:", error);
    return {
      success: false,
      error: "Failed to create prompt",
    };
  }
}

/**
 * Update an existing prompt
 */
export async function updatePrompt(
  input: UpdatePromptInput
): Promise<PromptActionResult<PromptResponse>> {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Authentication required. Please sign in to update prompts.",
      };
    }

    // Check permission
    const canEdit = await hasPermission(
      session.user.id,
      PERMISSIONS.EDIT_PROMPTS
    );
    if (!canEdit) {
      return {
        success: false,
        error:
          "You don't have permission to edit prompts. Please contact your system administrator to request 'Edit Prompts' permission.",
      };
    }

    const existingPrompt = await prisma.prompt.findUnique({
      where: { id: input.id },
    });

    if (!existingPrompt) {
      return {
        success: false,
        error: "Prompt not found",
      };
    }

    const updateData: any = {};

    if (input.promptTypeId !== undefined)
      updateData.promptTypeId = input.promptTypeId;
    if (input.version !== undefined) updateData.version = input.version;
    if (input.content !== undefined) updateData.content = input.content;
    if (input.isActive !== undefined) updateData.isActive = input.isActive;

    const prompt = await prisma.prompt.update({
      where: { id: input.id },
      data: updateData,
      include: { promptType: true },
    });

    revalidatePath("/prompts");

    return {
      success: true,
      data: prompt,
      message: "Prompt updated successfully",
    };
  } catch (error) {
    console.error("Error updating prompt:", error);
    return {
      success: false,
      error: "Failed to update prompt",
    };
  }
}

/**
 * Delete a prompt
 */
export async function deletePrompt(
  id: number
): Promise<PromptActionResult<void>> {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Authentication required. Please sign in to delete prompts.",
      };
    }

    // Check permission
    const canDelete = await hasPermission(
      session.user.id,
      PERMISSIONS.DELETE_PROMPTS
    );
    if (!canDelete) {
      return {
        success: false,
        error:
          "You don't have permission to delete prompts. Please contact your system administrator to request 'Delete Prompts' permission.",
      };
    }

    const existingPrompt = await prisma.prompt.findUnique({
      where: { id },
    });

    if (!existingPrompt) {
      return {
        success: false,
        error: "Prompt not found",
      };
    }

    await prisma.prompt.delete({
      where: { id },
    });

    revalidatePath("/prompts");

    return {
      success: true,
      message: "Prompt deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting prompt:", error);
    return {
      success: false,
      error: "Failed to delete prompt",
    };
  }
}

/**
 * Toggle prompt active status
 */
export async function togglePromptStatus(
  id: number
): Promise<PromptActionResult<PromptResponse>> {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Authentication required. Please sign in to modify prompts.",
      };
    }

    // Check permission
    const canEdit = await hasPermission(
      session.user.id,
      PERMISSIONS.EDIT_PROMPTS
    );
    if (!canEdit) {
      return {
        success: false,
        error:
          "You don't have permission to modify prompts. Please contact your system administrator to request 'Edit Prompts' permission.",
      };
    }

    const existingPrompt = await prisma.prompt.findUnique({
      where: { id },
    });

    if (!existingPrompt) {
      return {
        success: false,
        error: "Prompt not found",
      };
    }

    const prompt = await prisma.prompt.update({
      where: { id },
      data: { isActive: !existingPrompt.isActive },
    });

    revalidatePath("/prompts");

    return {
      success: true,
      data: prompt,
      message: `Prompt ${prompt.isActive ? "activated" : "deactivated"} successfully`,
    };
  } catch (error) {
    console.error("Error toggling prompt status:", error);
    return {
      success: false,
      error: "Failed to toggle prompt status",
    };
  }
}

/**
 * Duplicate a prompt
 */
export async function duplicatePrompt(
  id: number
): Promise<PromptActionResult<PromptResponse>> {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Authentication required. Please sign in to duplicate prompts.",
      };
    }

    // Check permission
    const canCreate = await hasPermission(
      session.user.id,
      PERMISSIONS.CREATE_PROMPTS
    );
    if (!canCreate) {
      return {
        success: false,
        error:
          "You don't have permission to create prompts. Please contact your system administrator to request 'Create Prompts' permission.",
      };
    }

    const existingPrompt = await prisma.prompt.findUnique({
      where: { id },
    });

    if (!existingPrompt) {
      return {
        success: false,
        error: "Prompt not found",
      };
    }

    const prompt = await prisma.prompt.create({
      data: {
        promptTypeId: existingPrompt.promptTypeId,
        version: "v1",
        content: existingPrompt.content,
        isActive: false, // Start as inactive for review
        createdBy: existingPrompt.createdBy,
      },
      include: { promptType: true },
    });

    revalidatePath("/prompts");

    return {
      success: true,
      data: prompt,
      message: "Prompt duplicated successfully",
    };
  } catch (error) {
    console.error("Error duplicating prompt:", error);
    return {
      success: false,
      error: "Failed to duplicate prompt",
    };
  }
}

/**
 * Get prompt statistics
 */
export async function getPromptStats(): Promise<
  PromptActionResult<{
    total: number;
    active: number;
    inactive: number;
    latestVersion: string;
  }>
> {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error:
          "Authentication required. Please sign in to view prompt statistics.",
      };
    }

    // Check permission
    const canView = await hasPermission(
      session.user.id,
      PERMISSIONS.VIEW_PROMPTS
    );
    if (!canView) {
      return {
        success: false,
        error:
          "You don't have permission to view prompts. Please contact your system administrator to request access.",
      };
    }
    const total = await prisma.prompt.count();
    const active = await prisma.prompt.count({ where: { isActive: true } });
    const inactive = total - active;

    const latestPrompt = await prisma.prompt.findFirst({
      orderBy: { updatedAt: "desc" },
      select: { version: true },
    });

    return {
      success: true,
      data: {
        total,
        active,
        inactive,
        latestVersion: latestPrompt?.version || "v1",
      },
    };
  } catch (error) {
    console.error("Error fetching prompt stats:", error);
    return {
      success: false,
      error: "Failed to fetch prompt statistics",
    };
  }
}
