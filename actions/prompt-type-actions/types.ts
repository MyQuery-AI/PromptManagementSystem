export interface CreatePromptTypeInput {
  name: string;
  usage: string;
  color: string;
  bgColor: string;
  textColor: string;
  icon: string;
}

export interface UpdatePromptTypeInput {
  id: string;
  name: string;
  usage: string;
  color: string;
  bgColor: string;
  textColor: string;
  icon: string;
}

export interface PromptTypeResponse {
  id: string;
  name: string;
  usage: string;
  color: string;
  bgColor: string;
  textColor: string;
  icon: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ActionResponse<T = null> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
