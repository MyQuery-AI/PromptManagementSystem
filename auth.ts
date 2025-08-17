import NextAuth from "next-auth";
import authProviders from "./lib/auth/auth-providers";
import { PrismaClient } from "@/app/generated/prisma";
import {
  initializeUserPermissions,
  hasInitializedPermissions,
} from "@/actions/user-actions/permission-initialization";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle OAuth sign-ins (Google)
      if (account?.provider === "google") {
        try {
          // Check if user already exists
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          if (existingUser) {
            // User exists, ensure they're confirmed for OAuth
            if (!existingUser.emailConfirmed) {
              await prisma.user.update({
                where: { id: existingUser.id },
                data: {
                  emailConfirmed: true,
                  name: user.name || existingUser.name,
                },
              });
            }

            // Check if user has initialized permissions, if not, initialize them
            const hasPermissions = await hasInitializedPermissions(
              existingUser.id
            );
            if (!hasPermissions) {
              try {
                await initializeUserPermissions(
                  existingUser.id,
                  existingUser.role
                );
              } catch (error) {
                console.error(
                  "Failed to initialize permissions for existing user:",
                  error
                );
              }
            }

            return true;
          }

          // Create new user for OAuth sign-in
          const randomPassword = await bcrypt.hash(crypto.randomUUID(), 12);
          const newUser = await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name || "",
              password: randomPassword, // OAuth users get a random hashed password
              emailConfirmed: true, // OAuth emails are pre-verified
              role: "Owner", // Default role for new users
            },
          });

          // Initialize permissions for new user
          try {
            await initializeUserPermissions(newUser.id, "Developer");
          } catch (error) {
            console.error(
              "Failed to initialize permissions for new OAuth user:",
              error
            );
          }

          return true;
        } catch (error) {
          console.error("OAuth sign-in error:", error);
          return false;
        }
      }
      return false;
    },
    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        // Get user from database to ensure we have the latest data
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
          select: {
            id: true,
            email: true,
            name: true,
            emailConfirmed: true,
            createdAt: true,
          },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.email = dbUser.email;
          token.name = dbUser.name;
          token.emailVerified = dbUser.emailConfirmed;
          token.emailVerifiedBoolean = dbUser.emailConfirmed;
        }
      }

      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.emailVerified = token.emailVerified ? new Date() : null;
        session.user.emailVerifiedBoolean = token.emailVerified === true;
      }

      return session;
    },
  },
  ...authProviders,
});
