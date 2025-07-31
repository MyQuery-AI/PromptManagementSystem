"use server";
import { PrismaClient } from "@/app/generated/prisma";
import { auth } from "@/auth";
import {
  PERMISSIONS,
  ROLE_PERMISSIONS,
  type Permission,
} from "@/lib/permissions-config";

const prismaClient = new PrismaClient();

/**
 * Grant a specific permission to a user (in addition to their role permissions)
 * Only Owners can grant individual permissions
 */
export async function grantPermissionToUser(
  targetUserId: string,
  permission: Permission
) {
  const session = await auth();

  try {
    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    // Check if current user is Owner
    const currentUser = await prismaClient.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (currentUser?.role !== "Owner") {
      throw new Error("Only Owners can grant individual permissions");
    }

    // Check if user already has this permission (including revoked ones)
    const existingPermission = await prismaClient.userPermission.findUnique({
      where: {
        userId_permission: {
          userId: targetUserId,
          permission: permission,
        },
      },
    });

    if (existingPermission && !existingPermission.isRevoked) {
      throw new Error("User already has this permission");
    }

    // Grant the permission (or un-revoke it)
    const newPermission = await prismaClient.userPermission.upsert({
      where: {
        userId_permission: {
          userId: targetUserId,
          permission: permission,
        },
      },
      update: {
        isRevoked: false,
      },
      create: {
        userId: targetUserId,
        permission: permission,
        isRevoked: false,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
    });

    return newPermission;
  } catch (error) {
    console.error("Error granting permission:", error);
    throw new Error("Failed to grant permission");
  }
}

/**
 * Revoke any permission from user (role-based or individual)
 * Only Owners can revoke any permissions
 * For any permissions, we create or update a permission entry with isRevoked=true
 */
export async function revokeAnyPermissionFromUser(
  targetUserId: string,
  permission: Permission
) {
  const session = await auth();

  try {
    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    // Check if current user is Owner
    const currentUser = await prismaClient.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (currentUser?.role !== "Owner") {
      throw new Error("Only Owners can revoke any permissions");
    }

    // Check if the user exists
    const user = await prismaClient.user.findUnique({
      where: { id: targetUserId },
      select: { id: true, role: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Create or update permission entry to mark as revoked
    const revokedPermission = await prismaClient.userPermission.upsert({
      where: {
        userId_permission: {
          userId: targetUserId,
          permission: permission,
        },
      },
      update: {
        isRevoked: true,
      },
      create: {
        userId: targetUserId,
        permission: permission,
        isRevoked: true,
      },
    });

    return {
      success: true,
      message: `Successfully revoked permission "${permission}" from user`,
      revokedPermission,
    };
  } catch (error) {
    console.error("Error revoking permission:", error);
    throw new Error("Failed to revoke permission");
  }
}
export async function revokePermissionFromUser(
  targetUserId: string,
  permission: Permission
) {
  const session = await auth();

  try {
    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    // Check if current user is Owner
    const currentUser = await prismaClient.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (currentUser?.role !== "Owner") {
      throw new Error("Only Owners can revoke individual permissions");
    }

    // Remove the permission
    const deletedPermission = await prismaClient.userPermission.delete({
      where: {
        userId_permission: {
          userId: targetUserId,
          permission: permission,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
    });

    return deletedPermission;
  } catch (error) {
    console.error("Error revoking permission:", error);
    throw new Error("Failed to revoke permission");
  }
}

/**
 * Get all permissions for a user (role-based + individual grants - revoked)
 */
export async function getUserAllPermissions(userId: string) {
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

    if (!user) {
      throw new Error("User not found");
    }

    // Get role-based permissions
    const rolePermissions =
      user.role === "Owner"
        ? Object.values(PERMISSIONS)
        : ROLE_PERMISSIONS[user.role] || [];

    // Get individual granted permissions (not revoked)
    const individualPermissions = user.userPermissions
      .filter((up) => !up.isRevoked)
      .map((up) => up.permission);

    // Get revoked permissions
    const revokedPermissions = user.userPermissions
      .filter((up) => up.isRevoked)
      .map((up) => up.permission);

    // Start with role permissions and add individual grants
    let allPermissions = [...rolePermissions, ...individualPermissions];

    // Remove revoked permissions
    allPermissions = allPermissions.filter(
      (permission) => !revokedPermissions.includes(permission)
    );

    // Deduplicate
    allPermissions = Array.from(new Set(allPermissions));

    return {
      userId,
      role: user.role,
      rolePermissions,
      individualPermissions,
      revokedPermissions,
      allPermissions,
    };
  } catch (error) {
    console.error("Error getting user permissions:", error);
    throw new Error("Failed to get user permissions");
  }
}

/**
 * Grant multiple permissions at once
 */
export async function grantMultiplePermissions(
  targetUserId: string,
  permissions: Permission[]
) {
  const session = await auth();

  try {
    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    // Check if current user is Owner
    const currentUser = await prismaClient.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (currentUser?.role !== "Owner") {
      throw new Error("Only Owners can grant permissions");
    }

    // Use transaction to grant all permissions
    const grantedPermissions = await prismaClient.$transaction(
      permissions.map((permission) =>
        prismaClient.userPermission.upsert({
          where: {
            userId_permission: {
              userId: targetUserId,
              permission: permission,
            },
          },
          update: {
            isRevoked: false, // Un-revoke if it was revoked
          },
          create: {
            userId: targetUserId,
            permission: permission,
            isRevoked: false,
          },
        })
      )
    );

    return grantedPermissions;
  } catch (error) {
    console.error("Error granting multiple permissions:", error);
    throw new Error("Failed to grant permissions");
  }
}

/**
 * Synchronize a user's permissions with their role
 * This will grant missing role-based permissions and optionally remove extra permissions
 */
export async function syncUserPermissionsWithRole(
  targetUserId: string,
  removeExtraPermissions: boolean = false
) {
  const session = await auth();

  try {
    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    // Check if current user is Owner
    const currentUser = await prismaClient.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (currentUser?.role !== "Owner") {
      throw new Error("Only Owners can sync permissions");
    }

    // Get the target user
    const user = await prismaClient.user.findUnique({
      where: { id: targetUserId },
      select: {
        id: true,
        role: true,
        userPermissions: {
          select: {
            permission: true,
            isRevoked: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Get expected permissions for the user's role
    const expectedPermissions: Permission[] =
      user.role === "Owner"
        ? (Object.values(PERMISSIONS) as Permission[])
        : [...(ROLE_PERMISSIONS[user.role] || [])];

    // Get current effective permissions (what the user actually has)
    const userPermissions = await getUserAllPermissions(targetUserId);
    const currentEffectivePermissions = userPermissions.allPermissions;

    // Find missing permissions (expected but not in effective permissions)
    const missingPermissions = expectedPermissions.filter(
      (permission) => !currentEffectivePermissions.includes(permission)
    );

    // Find extra permissions (in effective permissions but not expected)
    const extraPermissions: Permission[] = removeExtraPermissions
      ? currentEffectivePermissions.filter(
          (permission) =>
            !(expectedPermissions as readonly Permission[]).includes(permission)
        )
      : [];

    console.log("Sync Debug:", {
      userId: targetUserId,
      role: user.role,
      expectedPermissions,
      currentEffectivePermissions,
      missingPermissions,
      extraPermissions,
    });

    const results = {
      granted: [] as string[],
      revoked: [] as string[],
      errors: [] as string[],
    };

    // Grant missing permissions
    if (missingPermissions.length > 0) {
      try {
        await prismaClient.$transaction(
          missingPermissions.map((permission) =>
            prismaClient.userPermission.upsert({
              where: {
                userId_permission: {
                  userId: targetUserId,
                  permission: permission,
                },
              },
              update: {
                isRevoked: false, // Un-revoke if it was revoked
              },
              create: {
                userId: targetUserId,
                permission: permission,
                isRevoked: false,
              },
            })
          )
        );
        results.granted = missingPermissions;
      } catch (error) {
        results.errors.push(`Failed to grant permissions: ${error}`);
      }
    }

    // Remove extra permissions by marking them as revoked
    if (extraPermissions.length > 0) {
      try {
        await prismaClient.$transaction(
          extraPermissions.map((permission) =>
            prismaClient.userPermission.upsert({
              where: {
                userId_permission: {
                  userId: targetUserId,
                  permission: permission,
                },
              },
              update: {
                isRevoked: true,
              },
              create: {
                userId: targetUserId,
                permission: permission,
                isRevoked: true,
              },
            })
          )
        );
        results.revoked = extraPermissions;
      } catch (error) {
        results.errors.push(`Failed to revoke permissions: ${error}`);
      }
    }

    return {
      success: true,
      results,
      message: `Synchronized permissions for ${user.role} role`,
    };
  } catch (error) {
    console.error("Error syncing permissions:", error);
    throw new Error("Failed to sync permissions");
  }
}

/**
 * Sync all users' permissions with their roles
 * Useful for running a system-wide permission audit and fix
 */
export async function syncAllUsersPermissions(
  removeExtraPermissions: boolean = false
) {
  const session = await auth();

  try {
    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    // Check if current user is Owner
    const currentUser = await prismaClient.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (currentUser?.role !== "Owner") {
      throw new Error("Only Owners can sync all permissions");
    }

    // Get all users
    const users = await prismaClient.user.findMany({
      select: { id: true, email: true, role: true },
    });

    const syncResults = [];

    // Sync each user's permissions
    for (const user of users) {
      try {
        const result = await syncUserPermissionsWithRole(
          user.id,
          removeExtraPermissions
        );
        syncResults.push({
          userId: user.id,
          email: user.email,
          role: user.role,
          ...result,
        });
      } catch (error) {
        syncResults.push({
          userId: user.id,
          email: user.email,
          role: user.role,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return {
      success: true,
      results: syncResults,
      message: `Synchronized permissions for ${users.length} users`,
    };
  } catch (error) {
    console.error("Error syncing all permissions:", error);
    throw new Error("Failed to sync all permissions");
  }
}
