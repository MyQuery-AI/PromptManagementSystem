"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
}

interface SidebarProps {
  items: SidebarItem[];
  className?: string;
}

export function Sidebar({ items, className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn("pb-12 w-64", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 font-semibold text-lg tracking-tight">
            Navigation
          </h2>
          <div className="space-y-1">
            {items.map((item) => (
              <Button
                key={item.href}
                variant={pathname === item.href ? "secondary" : "ghost"}
                className="justify-start w-full"
                asChild
              >
                <Link href={item.href}>
                  {item.icon && <span className="mr-2">{item.icon}</span>}
                  {item.title}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface SidebarLayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

export function SidebarLayout({ sidebar, children }: SidebarLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="flex flex-1 min-h-0">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="md:hidden z-40 fixed inset-0 flex">
          <div
            className="fixed inset-0 bg-black opacity-25"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative flex flex-col flex-1 bg-background border-r w-full max-w-xs">
            <div className="top-0 right-0 absolute -mr-12 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="flex justify-center items-center ml-1 rounded-full focus:outline-none focus:ring-2 focus:ring-white w-10 h-10"
              >
                <X className="w-6 h-6 text-white" />
                <span className="sr-only">Close sidebar</span>
              </Button>
            </div>
            {sidebar}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col flex-shrink-0 bg-background border-r w-64">
        {sidebar}
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Mobile header */}
        <div className="md:hidden top-0 z-10 sticky flex flex-shrink-0 bg-background border-b h-16">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="md:hidden px-4 border-gray-200 border-r focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset text-gray-500"
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="w-6 h-6" />
          </Button>
        </div>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
