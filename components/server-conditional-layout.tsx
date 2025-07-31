import { auth } from "@/auth";
import { ClientConditionalLayout } from "./client-conditional-layout";

export async function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  let userRole: "Owner" | "Admin" | "Developer" | null = null;

  if (session?.user?.email) {
    try {
      const { PrismaClient } = await import("@/app/generated/prisma");
      const prisma = new PrismaClient();

      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { role: true },
      });

      if (user) {
        userRole = user.role as "Owner" | "Admin" | "Developer";
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  }

  return (
    <ClientConditionalLayout userRole={userRole}>
      {children}
    </ClientConditionalLayout>
  );
}
