export interface CreatePromptInput {
  feature: string;
  promptType: string;
  version?: string;
  content: string;
  isActive?: boolean;
  createdBy?: string;
}

export interface UpdatePromptInput {
  id: number;
  feature?: string;
  promptType?: string;
  version?: string;
  content?: string;
  isActive?: boolean;
}

export interface PromptFilters {
  search?: string;
  isActive?: boolean;
  feature?: string;
  promptType?: string;
  createdBy?: string;
}

export interface PromptResponse {
  id: number;
  feature: string;
  promptType: string;
  version: string;
  content: string;
  isActive: boolean;
  createdBy: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PromptActionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
