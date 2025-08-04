import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth();

  if (session?.user) {
    // User is logged in, redirect to dashboard
    redirect("/dashboard");
  } else {
    // User is not logged in, redirect to login
    redirect("/login");
  }
}
