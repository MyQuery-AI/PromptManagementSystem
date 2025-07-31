"use server";
import { PrismaClient } from "@/app/generated/prisma";
import { auth } from "@/auth";
import type { User, UserStats } from "@/types/user";

const prismaClient = new PrismaClient();

// Get all users (only Owners can do this)
export async function getAllUsers(): Promise<User[]> {
  const session = await auth();
  try {
    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const adminUser = await prismaClient.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (adminUser?.role !== "Owner") {
      throw new Error("Unauthorized");
    }

    const users = await prismaClient.user.findMany({
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

    if (!users) {
      throw new Error("No users found");
    }

    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
}

// Get user statistics (only Owners can do this)
export async function getUserStats(): Promise<UserStats> {
  const session = await auth();
  try {
    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const adminUser = await prismaClient.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (adminUser?.role !== "Owner") {
      throw new Error("Unauthorized");
    }

    const totalUsers = await prismaClient.user.count();
    const adminUsers = await prismaClient.user.count({
      where: {
        OR: [{ role: "Owner" }, { role: "Admin" }],
      },
    });

    return {
      totalUsers,
      adminUsers,
    };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    throw new Error("Failed to fetch user stats");
  }
}
