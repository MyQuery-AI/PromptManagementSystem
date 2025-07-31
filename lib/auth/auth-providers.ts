import { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaClient } from "@/app/generated/prisma";
import { loginSchema } from "@/lib/schemas/auth";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export default {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Enter your email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      async authorize(credentials) {
        try {
          // Validate credentials using your schema
          const validatedFields = loginSchema.safeParse(credentials);

          if (!validatedFields.success) {
            console.error(
              "Credentials validation failed:",
              validatedFields.error
            );
            return null;
          }

          const { email, password } = validatedFields.data;

          // Find user in database
          const user = await prisma.user.findUnique({
            where: { email },
            select: {
              id: true,
              email: true,
              name: true,
              password: true,
              emailConfirmed: true,
              createdAt: true,
            },
          });

          if (!user) {
            console.error("User not found:", email);
            return null;
          }

          // Check if email is confirmed (OTP verified)
          if (!user.emailConfirmed) {
            console.error("Email not confirmed for user:", email);
            return null;
          }

          // Compare password using bcrypt
          const isPasswordValid = await bcrypt.compare(password, user.password);

          if (!isPasswordValid) {
            console.error("Invalid password for user:", email);
            return null;
          }

          console.log("User authenticated successfully:", {
            id: user.id,
            email: user.email,
          });

          // Return user object that will be stored in the JWT
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            emailVerified: user.emailConfirmed ? new Date() : null,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/logout",
  },
} satisfies NextAuthConfig;
