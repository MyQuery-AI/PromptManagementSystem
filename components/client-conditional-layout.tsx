"use client";

import { usePathname } from "next/navigation";
import { Sidebar, SidebarLayout } from "@/components/ui/sidebar";
import { FileText, Users, Settings, BarChart } from "lucide-react";

interface SidebarItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
  requiresRole?: "Owner" | "Admin" | "Developer";
}

const baseSidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <BarChart className="w-4 h-4" />,
  },
  {
    title: "Prompts",
    href: "/prompts",
    icon: <FileText className="w-4 h-4" />,
  },
  {
    title: "Users",
    href: "/users",
    icon: <Users className="w-4 h-4" />,
    requiresRole: "Owner", // Only Owners can see Users menu
  },
  {
    title: "Settings",
    href: "/settings",
    icon: <Settings className="w-4 h-4" />,
  },
];

const authRoutes = ["/login", "/register", "/email-test"];

interface ClientConditionalLayoutProps {
  children: React.ReactNode;
  userRole: "Owner" | "Admin" | "Developer" | null;
}

export function ClientConditionalLayout({
  children,
  userRole,
}: ClientConditionalLayoutProps) {
  const pathname = usePathname();

  // Filter sidebar items based on user role
  const filteredSidebarItems = baseSidebarItems.filter((item) => {
    if (!item.requiresRole) return true; // Show items without role requirements
    if (!userRole) return false; // Hide role-specific items if no role

    // Show Users menu only to Owners
    if (item.requiresRole === "Owner") {
      return userRole === "Owner";
    }

    return true;
  });

  // Check if current route is an auth route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // If it's an auth route, render children without sidebar
  if (isAuthRoute) {
    return <div className="flex-1 overflow-y-auto">{children}</div>;
  }

  // Render with filtered sidebar based on user role
  return (
    <SidebarLayout sidebar={<Sidebar items={filteredSidebarItems} />}>
      {children}
    </SidebarLayout>
  );
}
