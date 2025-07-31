"use server";
import { signIn } from "@/auth";
import { redirect } from "next/navigation";
import { loginSchema } from "@/lib/schemas/auth";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export type LoginState = {
  success: boolean;
  message: string;
  errors?: {
    email?: string[];
    password?: string[];
  };
};

export async function loginUser(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const rawFormData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  // Validate the form data
  const validatedFields = loginSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validation failed. Please check your inputs.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    // Check if user exists and email is confirmed before attempting sign in
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        emailConfirmed: true,
        password: true,
      },
    });

    if (!user) {
      return {
        success: false,
        message: "Invalid email or password.",
      };
    }

    if (!user.emailConfirmed) {
      return {
        success: false,
        message:
          "Please verify your email address before logging in. Check your inbox for the verification link.",
      };
    }

    // Use NextAuth signIn with credentials
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      console.error("NextAuth signIn error:", result.error);
      return {
        success: false,
        message: "Invalid email or password.",
      };
    }

    console.log("User logged in successfully:", { email });

    // Redirect to dashboard after successful login
  } catch (error) {
    console.error("Login error:", error);

    // Handle specific NextAuth errors
    if (error instanceof Error) {
      if (error.message.includes("CredentialsSignin")) {
        return {
          success: false,
          message: "Invalid email or password.",
        };
      }
    }

    return {
      success: false,
      message: "Login failed. Please try again.",
    };
  }
  redirect("/dashboard");
}
