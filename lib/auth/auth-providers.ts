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
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/logout",
  },
} satisfies NextAuthConfig;
