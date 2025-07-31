"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<
    "Owner" | "Admin" | "Developer" | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user role
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await fetch("/api/user/role");
        if (response.ok) {
          const data = await response.json();
          setUserRole(data.role);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  // Filter sidebar items based on user role
  const filteredSidebarItems = baseSidebarItems.filter((item) => {
    if (!item.requiresRole) return true; // Show items without role requirements
    if (!userRole) return false; // Hide role-specific items if role not loaded

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

  // Show loading state while fetching user role
  if (isLoading) {
    return (
      <SidebarLayout
        sidebar={
          <Sidebar
            items={baseSidebarItems.filter((item) => !item.requiresRole)}
          />
        }
      >
        {children}
      </SidebarLayout>
    );
  }

  // Otherwise, render with filtered sidebar based on user role
  return (
    <SidebarLayout sidebar={<Sidebar items={filteredSidebarItems} />}>
      {children}
    </SidebarLayout>
  );
}
