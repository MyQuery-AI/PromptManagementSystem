import type { Role } from "@/lib/permissions-config";

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  emailConfirmed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserStats {
  totalUsers: number;
  adminUsers: number;
}
