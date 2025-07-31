import { hasPermission, PERMISSIONS } from "@/actions/user-actions";
import { auth } from "@/auth";

// Server-side permission utilities
export class PermissionManager {
  static async checkPermission(permission: string): Promise<boolean> {
    const session = await auth();
    if (!session?.user?.id) {
      return false;
    }
    return await hasPermission(session.user.id, permission);
  }

  static async requirePermission(permission: string): Promise<void> {
    const hasAccess = await this.checkPermission(permission);
    if (!hasAccess) {
      throw new Error(`Access denied: Missing ${permission} permission`);
    }
  }

  static async requireOwner(): Promise<void> {
    return await this.requirePermission(PERMISSIONS.MANAGE_USERS);
  }

  static async canManageUsers(): Promise<boolean> {
    return await this.checkPermission(PERMISSIONS.MANAGE_USERS);
  }

  static async canManagePrompts(): Promise<boolean> {
    const canCreate = await this.checkPermission(PERMISSIONS.CREATE_PROMPTS);
    const canEdit = await this.checkPermission(PERMISSIONS.EDIT_PROMPTS);
    const canDelete = await this.checkPermission(PERMISSIONS.DELETE_PROMPTS);
    return canCreate || canEdit || canDelete;
  }

  static async canViewPrompts(): Promise<boolean> {
    return await this.checkPermission(PERMISSIONS.VIEW_PROMPTS);
  }

  static async getCurrentUserRole(): Promise<string | null> {
    const session = await auth();
    if (!session?.user?.id) {
      return null;
    }

    try {
      const { PrismaClient } = await import("@/app/generated/prisma");
      const prisma = new PrismaClient();

      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true },
      });

      return user?.role || null;
    } catch (error) {
      console.error("Error getting user role:", error);
      return null;
    }
  }
}

// Decorators for protecting API routes
export function requirePermission(permission: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      await PermissionManager.requirePermission(permission);
      return originalMethod.apply(this, args);
    };
  };
}

export function requireOwner() {
  return requirePermission(PERMISSIONS.MANAGE_USERS);
}
