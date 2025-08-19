import { PromptCategoryNames } from "@/app/generated/prisma";

export interface CreatePromptInput {
  promptTypeId: string;
  promptCategory: PromptCategoryNames;
  feature: string;
  version?: string;
  content: string;
  isActive?: boolean;
  createdBy?: string;
}

export interface UpdatePromptInput {
  id: number;
  promptTypeId?: string;
  promptCategory?: PromptCategoryNames;
  feature?: string;
  promptType?: string;
  version?: string;
  content?: string;
  isActive?: boolean;
}

export interface PromptFilters {
  search?: string;
  isActive?: boolean;
  promptTypeId?: string;
  promptCategory?: PromptCategoryNames;
  feature?: string;
  promptType?: string;
  createdBy?: string;
}

export interface PromptResponse {
  id: number;
  promptTypeId: string;
  promptCategory: PromptCategoryNames;
  feature?: string;
  version: string;
  content: string;
  isActive: boolean;
  createdBy: string | null;
  createdAt: Date;
  updatedAt: Date;
  promptType?: {
    id: string;
    name: string;
    color: string;
    bgColor: string;
    textColor: string;
    usage: string;
    icon: string | null;
  };
}

export interface PromptActionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
