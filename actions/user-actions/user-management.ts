"use server";
import { PrismaClient } from "@/app/generated/prisma";
import { auth } from "@/auth";
import { ROLE_PERMISSIONS, type Role } from "@/lib/permissions-config";
import { syncUserPermissions } from "./permission-initialization";

const prismaClient = new PrismaClient();

// Update user role (only Owners can do this)
export async function updateUserRole(targetUserId: string, newRole: Role) {
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
      throw new Error("Only Owners can manage user roles");
    }

    // Get the user's current role and permissions
    const targetUser = await prismaClient.user.findUnique({
      where: { id: targetUserId },
      select: {
        role: true,
        userPermissions: {
          select: { permission: true },
        },
      },
    });

    if (!targetUser) {
      throw new Error("User not found");
    }

    // Use transaction to update role and sync permissions
    const updatedUser = await prismaClient.$transaction(async (tx) => {
      // 1. Update the user's role
      const user = await tx.user.update({
        where: { id: targetUserId },
        data: { role: newRole },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          emailConfirmed: true,
        },
      });

      return user;
    });

    // 2. Sync permissions after role change (outside transaction)
    await syncUserPermissions(targetUserId, newRole);

    return updatedUser;
  } catch (error) {
    console.error("Error updating user role:", error);
    throw new Error("Failed to update user role");
  }
}

// Delete user (only Owners can do this)
export async function deleteUser(targetUserId: string) {
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
      throw new Error("Only Owners can delete users");
    }

    // Prevent self-deletion
    if (session.user.id === targetUserId) {
      throw new Error("Cannot delete your own account");
    }

    // Delete the user
    await prismaClient.user.delete({
      where: { id: targetUserId },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Failed to delete user");
  }
}
