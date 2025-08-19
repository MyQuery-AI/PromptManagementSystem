export interface PromptHistoryResponse {
  id: number;
  feature: string;
  currentVersion: string;
  version: string;
  content: string;
}

export interface ActionResponse<T = null> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
