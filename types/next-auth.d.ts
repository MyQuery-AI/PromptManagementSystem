import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role?: string;
    id?: string;
    sub?: string;
    emailVerified?: Date | null;
    emailVerifiedBoolean?: boolean | null;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role?: string;
      sub?: string;
      emailVerified?: Date | null;
      emailVerifiedBoolean?: boolean;
    } & DefaultSession["user"];
  }

  interface JWT {
    role?: string;
    id?: string;
    emailVerified?: boolean;
    emailVerifiedBoolean?: boolean;
  }
}
