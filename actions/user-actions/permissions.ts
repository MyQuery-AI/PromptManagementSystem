"use server";
import { PrismaClient } from "@/app/generated/prisma";
import { auth } from "@/auth";
import {
  PERMISSIONS,
  ROLE_PERMISSIONS,
  type Role,
} from "@/lib/permissions-config";

const prismaClient = new PrismaClient();

// Check if user has specific permission
export async function hasPermission(
  userId: string,
  permission: string
): Promise<boolean> {
  try {
    const user = await prismaClient.user.findUnique({
      where: { id: userId },
      select: {
        role: true,
        userPermissions: {
          select: {
            permission: true,
            isRevoked: true,
          },
        },
      },
    });

    if (!user) return false;

    // Check if the permission is explicitly revoked
    const revokedPermission = user.userPermissions.find(
      (up) => up.permission === permission && up.isRevoked
    );
    if (revokedPermission) return false;

    // Check if the permission is explicitly granted
    const grantedPermission = user.userPermissions.find(
      (up) => up.permission === permission && !up.isRevoked
    );
    if (grantedPermission) return true;

    // Owners have all permissions by default (unless explicitly revoked)
    if (user.role === "Owner") return true;

    // Check user's role-based permissions
    const rolePermissions = ROLE_PERMISSIONS[user.role];
    return rolePermissions.includes(permission as any);
  } catch (error) {
    console.error("Error checking permission:", error);
    return false;
  }
}

// Get user with their role and permissions info
export async function getUserWithPermissions(userId: string) {
  try {
    const user = await prismaClient.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        emailConfirmed: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) return null;

    // Get permissions for the user's role
    const permissions =
      user.role === "Owner"
        ? Object.values(PERMISSIONS)
        : ROLE_PERMISSIONS[user.role];

    return {
      ...user,
      permissions,
    };
  } catch (error) {
    console.error("Error fetching user with permissions:", error);
    return null;
  }
}

// Get user role by ID
export async function getUserRole(userId: string): Promise<Role | null> {
  try {
    const user = await prismaClient.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    return (user?.role as Role) || null;
  } catch (error) {
    console.error("Error fetching user role:", error);
    return null;
  }
}
