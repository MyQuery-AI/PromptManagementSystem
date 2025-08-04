"use server";
import { signIn } from "@/auth";
import { PrismaClient } from "@/app/generated/prisma";
import { redirect } from "next/navigation";
import { z } from "zod";

const prisma = new PrismaClient();

export interface OtpState {
  success: boolean;
  message: string;
  errors?: {
    otp?: string[];
    email?: string[];
  };
}

const otpSchema = z.object({
  email: z.email("Invalid email address"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export async function verifyOTP(
  prevState: OtpState,
  formData: FormData
): Promise<OtpState> {
  try {
    const email = formData.get("email") as string;
    const otp = formData.get("otp") as string;

    // Validate input
    const validation = otpSchema.safeParse({ email, otp });
    if (!validation.success) {
      return {
        success: false,
        message: "Invalid input",
        errors: validation.error.flatten().fieldErrors,
      };
    }

    // Find user with matching email and OTP
    const user = await prisma.user.findFirst({
      where: {
        email: email,
        otp: otp,
        otpExpiresAt: {
          gt: new Date(), // OTP should not be expired
        },
      },
    });

    if (!user) {
      return {
        success: false,
        message: "Invalid or expired verification code",
      };
    }

    // Update user to confirm email and clear OTP
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailConfirmed: true,
        otp: null,
        otpId: null,
        otpExpiresAt: null,
      },
    });

    // Redirect to sign in page or automatically sign in
    redirect("/login?message=Email verified successfully. Please sign in.");
  } catch (error) {
    console.error("OTP verification error:", error);
    return {
      success: false,
      message: "An error occurred during verification. Please try again.",
    };
  }
}

export async function signInWithGoogle() {
  await signIn("google", { redirectTo: "/dashboard" });
}

export async function signInWithGitHub() {
  await signIn("github", { redirectTo: "/dashboard" });
}
