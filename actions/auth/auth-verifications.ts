"use server";
import { PrismaClient } from "@/app/generated/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const prismaClient = new PrismaClient();

export const getUserById = async () => {
  const user = await auth();
  if (!user) {
    throw new Error("User not authenticated");
  }
  const userId = user.user.id;
  return userId;
};
export const getUserByEmail = async (email: string) => {
  const user = await prismaClient.user.findUnique({
    where: { email },
    select: { id: true },
  });
  return user?.id;
};

export const isOtpValid = async (email: string) => {
  const userId = await getUserByEmail(email);
  if (!userId) {
    throw new Error("User not found");
  }

  const otp = await prismaClient.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      otpExpiresAt: true,
      otpId: true,
    },
  });
  if (!otp?.otpId || !otp?.otpExpiresAt) {
    throw new Error("No valid OTP found");
  }
  if (otp.otpExpiresAt < new Date()) {
    throw new Error("OTP has expired");
  }
  return otp;
};

export const validateOtpByOtpId = async (otpId: string) => {
  const user = await prismaClient.user.findUnique({
    where: { otpId },
    select: {
      id: true,
      email: true,
      otp: true,
      otpId: true,
      otpExpiresAt: true,
      emailConfirmed: true,
    },
  });

  if (!user) {
    return { valid: false, reason: "INVALID_OTP_ID", user: null };
  }

  if (user.emailConfirmed) {
    return { valid: false, reason: "ALREADY_CONFIRMED", user };
  }

  if (!user.otp || !user.otpExpiresAt) {
    return { valid: false, reason: "NO_OTP", user };
  }

  if (user.otpExpiresAt < new Date()) {
    return { valid: false, reason: "EXPIRED", user };
  }

  return { valid: true, reason: "VALID", user };
};

export const deleteUserRecord = async (userId: string) => {
  try {
    await prismaClient.user.delete({
      where: { id: userId },
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to delete user record:", error);
    return { success: false, error };
  }
};

export const checkOtpValidityAndRedirect = async (otpId: string) => {
  const validation = await validateOtpByOtpId(otpId);

  if (!validation.valid) {
    console.log(
      `OTP validation failed: ${validation.reason} for otpId: ${otpId}`
    );

    // Delete invalid user records (except for already confirmed users)
    if (validation.user && validation.reason !== "ALREADY_CONFIRMED") {
      await deleteUserRecord(validation.user.id);
      console.log(`Deleted invalid user record: ${validation.user.email}`);
    }

    // Redirect based on the reason
    switch (validation.reason) {
      case "ALREADY_CONFIRMED":
        redirect("/login?message=already-confirmed");
      case "EXPIRED":
        redirect("/register?message=otp-expired");
      case "NO_OTP":
      case "INVALID_OTP_ID":
      default:
        redirect("/register?message=invalid-link");
    }
  }

  return validation.user;
};
