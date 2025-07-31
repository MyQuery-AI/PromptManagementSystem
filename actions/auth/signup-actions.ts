"use server";
import { PrismaClient } from "@/app/generated/prisma";
import {
  generateOTPEmailTemplate,
  generateWelcomeEmailTemplate,
  sendEmail,
} from "@/lib/email/email-service";
import {
  emailRegistrationSchema,
  passwordSetupSchema,
} from "@/lib/schemas/auth";
import { initializeUserPermissions } from "@/actions/user-actions/permission-initialization";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export type EmailRegistrationState = {
  success: boolean;
  message: string;
  errors?: {
    email?: string[];
  };
};

export type PasswordSetupState = {
  success: boolean;
  message: string;
  errors?: {
    otpId?: string[];
    otp?: string[];
    name?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
};

export async function sendEmailOTP(
  prevState: EmailRegistrationState,
  formData: FormData
): Promise<EmailRegistrationState> {
  const rawFormData = {
    email: formData.get("email"),
  };

  // Validate the form data
  const validatedFields = emailRegistrationSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validation failed. Please check your inputs.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email } = validatedFields.data;

  try {
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser && existingUser.emailConfirmed) {
      return {
        success: false,
        message: "An account with this email already exists.",
      };
    }

    // If user exists but not confirmed, delete the old record
    if (existingUser && !existingUser.emailConfirmed) {
      await prisma.user.delete({
        where: { id: existingUser.id },
      });
    }

    // Generate OTP and otpId
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpId = crypto.randomUUID();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP temporarily in database
    await prisma.user.create({
      data: {
        email,
        password: "", // Will be set later
        otp,
        otpId,
        otpExpiresAt,
        emailConfirmed: false,
        role: "Developer", // Default role for new users
      },
    });

    // Send OTP email
    try {
      const setupLink = `${
        process.env.NEXTAUTH_URL || "http://localhost:3000"
      }/register/setup/${otpId}`;
      const emailTemplate = generateOTPEmailTemplate(otp, email, setupLink);
      await sendEmail({
        to: email,
        subject: "Verify Your Email - OTP Code",
        html: emailTemplate.html,
        text: emailTemplate.text,
      });

      console.log("OTP email sent successfully to:", email);

      return {
        success: true,
        message:
          "Verification email sent! Please check your inbox and click the link to complete your registration.",
      };
    } catch (emailError) {
      console.error("Failed to send OTP email:", emailError);
      // Delete the user record if email fails
      await prisma.user.delete({
        where: { otpId },
      });

      return {
        success: false,
        message: "Failed to send verification email. Please try again.",
      };
    }
  } catch (error) {
    console.error("Email OTP error:", error);
    return {
      success: false,
      message: "Failed to send OTP. Please try again.",
    };
  }
}
export async function setupPassword(
  prevState: PasswordSetupState,
  formData: FormData
): Promise<PasswordSetupState> {
  const rawFormData = {
    otpId: formData.get("otpId"),
    otp: formData.get("otp"),
    name: formData.get("name"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  // Validate the form data
  const validatedFields = passwordSetupSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validation failed. Please check your inputs.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { otpId, otp, name, password } = validatedFields.data;

  try {
    // Find user by otpId and verify OTP
    const user = await prisma.user.findUnique({
      where: { otpId },
    });

    if (!user) {
      return {
        success: false,
        message: "Invalid verification link. Please try again.",
      };
    }

    if (user.otp !== otp) {
      return {
        success: false,
        message: "Invalid OTP. Please check your email and try again.",
      };
    }

    if (user.otpExpiresAt && user.otpExpiresAt < new Date()) {
      return {
        success: false,
        message: "OTP has expired. Please request a new one.",
      };
    }

    // Hash password with bcrypt
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update user with hashed password and mark as confirmed
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
        password: hashedPassword,
        emailConfirmed: true,
        otp: null,
        otpId: null,
        otpExpiresAt: null,
      },
    });

    // Initialize permissions for the new user
    try {
      await initializeUserPermissions(updatedUser.id, updatedUser.role);
    } catch (error) {
      console.error("Failed to initialize permissions for new user:", error);
    }

    // Send welcome email
    try {
      const welcomeTemplate = generateWelcomeEmailTemplate(name, user.email);
      await sendEmail({
        to: user.email,
        subject: "Welcome to Our Platform! 🎉",
        html: welcomeTemplate.html,
        text: welcomeTemplate.text,
      });

      console.log("Welcome email sent successfully to:", user.email);
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
      // Don't fail the registration if welcome email fails
    }

    console.log("User account created successfully for:", user.email);

    // Redirect to login page
  } catch (error) {
    console.error("Password setup error:", error);
    return {
      success: false,
      message: "Failed to create account. Please try again.",
    };
  }
  redirect("/login");
}

export type ResendOTPState = {
  success: boolean;
  message: string;
};

export async function resendOTP(
  prevState: ResendOTPState,
  formData: FormData
): Promise<ResendOTPState> {
  const otpId = formData.get("otpId") as string;

  if (!otpId) {
    return {
      success: false,
      message: "Invalid request. Please try again.",
    };
  }

  try {
    // Find user by otpId
    const user = await prisma.user.findUnique({
      where: { otpId },
    });

    if (!user) {
      return {
        success: false,
        message:
          "Invalid verification link. Please restart the registration process.",
      };
    }

    if (user.emailConfirmed) {
      return {
        success: false,
        message: "Email already verified. Please proceed to login.",
      };
    }

    // Generate new OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const newOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user with new OTP
    await prisma.user.update({
      where: { id: user.id },
      data: {
        otp: newOtp,
        otpExpiresAt: newOtpExpiresAt,
      },
    });

    // Send new OTP email
    try {
      const setupLink = `${
        process.env.NEXTAUTH_URL || "http://localhost:3000"
      }/register/setup/${otpId}`;
      const emailTemplate = generateOTPEmailTemplate(
        newOtp,
        user.email,
        setupLink
      );
      await sendEmail({
        to: user.email,
        subject: "New Verification Code - OTP Code",
        html: emailTemplate.html,
        text: emailTemplate.text,
      });

      console.log("New OTP email sent successfully to:", user.email);

      return {
        success: true,
        message: "New verification code sent to your email.",
      };
    } catch (emailError) {
      console.error("Failed to send new OTP email:", emailError);
      return {
        success: false,
        message: "Failed to send verification email. Please try again.",
      };
    }
  } catch (error) {
    console.error("Resend OTP error:", error);
    return {
      success: false,
      message: "Failed to resend verification code. Please try again.",
    };
  }
}
