"use server";

import { PrismaClient } from "@/app/generated/prisma";
import { auth } from "@/auth";
import type { ActionResponse, PromptHistoryResponse } from "./types";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export const getAllPromptHistory = async (): Promise<
  ActionResponse<PromptHistoryResponse[]>
> => {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return {
        success: false,
        error: "Authentication required",
      };
    }

    // Check if user has permission to view prompt history
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true },
    });

    if (!user || (user.role !== "Owner" && user.role !== "Admin")) {
      return {
        success: false,
        error: "Insufficient permissions to view prompt history",
      };
    }

    const promptHistoryRaw = await prisma.promptHistory.findMany({
      select: {
        prompt: {
          select: {
            id: true,
            feature: true,
            version: true,
          },
        },
        version: true,
        content: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const promptHistory = promptHistoryRaw.map((item) => ({
      id: item.prompt.id,
      feature: item.prompt.feature,
      currentVersion: item.prompt.version,
      version: item.version,
      content: item.content,
    }));

    return {
      success: true,
      data: promptHistory,
    };
  } catch (error) {
    console.error("Error fetching prompt history:", error);
    return {
      success: false,
      error: "Failed to fetch prompt history",
    };
  }
};

export const setActivePromptHistory = async (
  promptId: number,
  version: string,
  content: string
) => {
  try {
    // 1. Get the selected history
    const history = await prisma.promptHistory.findFirst({
      where: { promptId: promptId },
    });

    if (!history) {
      throw new Error(`Prompt history with id ${promptId} not found`);
    }

    // 2. Update the main Prompt table with this version + content
    const updatedPrompt = await prisma.prompt.update({
      where: { id: history.promptId }, // foreign key to Prompt
      data: {
        content: content,
        version: version,
        updatedAt: new Date(),
      },
    });
    return updatedPrompt;
  } catch (error) {
    console.error("Error setting active prompt history:", error);
    throw error;
  }
};
