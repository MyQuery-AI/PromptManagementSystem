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
