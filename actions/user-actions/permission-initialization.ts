"use server";
import { PrismaClient } from "@/app/generated/prisma";
import { ROLE_PERMISSIONS, type Role } from "@/lib/permissions-config";

const prismaClient = new PrismaClient();

/**
 * Initialize permissions for a new user based on their role
 * This should be called when a user is created or first logs in
 */
export async function initializeUserPermissions(
  userId: string,
  userRole: Role
) {
  try {
    // Get role-based permissions
    const rolePermissions = ROLE_PERMISSIONS[userRole] || [];

    // Grant all role-based permissions as individual permissions
    await prismaClient.userPermission.createMany({
      data: (rolePermissions as readonly string[]).map(
        (permission: string) => ({
          userId: userId,
          permission: permission as any,
        })
      ),
      skipDuplicates: true, // Prevent duplicates if already exists
    });

    console.log(
      `Initialized ${rolePermissions.length} permissions for user ${userId} with role ${userRole}`
    );

    return {
      userId,
      role: userRole,
      permissionsGranted: rolePermissions,
    };
  } catch (error) {
    console.error("Error initializing user permissions:", error);
    throw new Error("Failed to initialize user permissions");
  }
}

/**
 * Sync user permissions after role change
 * Clears old permissions and grants new ones based on the new role
 */
export async function syncUserPermissions(userId: string, newRole: Role) {
  try {
    return await prismaClient.$transaction(async (tx) => {
      // 1. Clear all existing individual permissions
      await tx.userPermission.deleteMany({
        where: { userId: userId },
      });

      // 2. Get new role permissions
      const newRolePermissions = ROLE_PERMISSIONS[newRole] || [];

      // 3. Grant new role-based permissions
      if ((newRolePermissions as readonly string[]).length > 0) {
        await tx.userPermission.createMany({
          data: (newRolePermissions as readonly string[]).map(
            (permission: string) => ({
              userId: userId,
              permission: permission as any,
            })
          ),
          skipDuplicates: true,
        });
      }

      console.log(
        `Synced permissions for user ${userId}: removed old, granted ${newRolePermissions.length} new permissions for role ${newRole}`
      );

      return {
        userId,
        newRole,
        permissionsGranted: newRolePermissions,
      };
    });
  } catch (error) {
    console.error("Error syncing user permissions:", error);
    throw new Error("Failed to sync user permissions");
  }
}

/**
 * Check if user has initialized permissions
 * Used to determine if we need to run initialization
 */
export async function hasInitializedPermissions(
  userId: string
): Promise<boolean> {
  try {
    const count = await prismaClient.userPermission.count({
      where: { userId: userId },
    });

    return count > 0;
  } catch (error) {
    console.error("Error checking initialized permissions:", error);
    return false;
  }
}
