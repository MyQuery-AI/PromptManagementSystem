import { Suspense } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

// Force dynamic rendering since we use authentication
export const dynamic = "force-dynamic";

import {
  Users,
  UserPlus,
  Shield,
  MoreHorizontal,
  Settings,
  UserCheck,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UsersTableWrapper } from "@/components/users-table-wrapper";
import { RolePermissionsDisplay } from "@/components/permission-gate";
import {
  UserStatsCardSkeleton,
  UserTableSkeleton,
  RoleCardSkeleton,
} from "@/components/skeletons";
import { getUserRole } from "@/actions/user-actions/permissions";
import { getAllUsers, getUserStats } from "@/actions/user-actions";
import type { User, UserStats } from "@/types/user";

// Server component for user stats
async function UserStatsCards() {
  let stats: UserStats = { totalUsers: 0, adminUsers: 0 };

  try {
    stats = await getUserStats();
  } catch (error) {
    console.error("Error loading stats:", error);
  }

  return (
    <div className="gap-4 grid md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">Total Users</CardTitle>
          <Users className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">{stats.totalUsers}</div>
          <p className="text-muted-foreground text-xs">
            {stats.totalUsers === 0
              ? "No users registered yet"
              : "Registered users"}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">Admins</CardTitle>
          <Shield className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">{stats.adminUsers}</div>
          <p className="text-muted-foreground text-xs">Admin users</p>
        </CardContent>
      </Card>
    </div>
  );
}

// Server component for users table
async function UsersTableSection({ currentUserId }: { currentUserId: string }) {
  let users: User[] = [];
  let error: string | null = null;

  try {
    users = await getAllUsers();
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load user data";
    console.error("Error loading users:", err);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>Manage user accounts and permissions</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-50 mb-4 p-4 border border-red-200 rounded-md">
            <p className="text-red-600">Error: {error}</p>
          </div>
        )}
        {!error && users.length > 0 ? (
          <UsersTableWrapper users={users} currentUserId={currentUserId} />
        ) : (
          <div className="flex justify-center items-center h-64 text-center">
            <div>
              <Users className="mx-auto mb-4 w-12 h-12 text-gray-400" />
              <h3 className="mb-2 font-semibold text-gray-900 text-lg">
                {error ? "Unable to Load Users" : "No Users Found"}
              </h3>
              <p className="mb-4 text-gray-600">
                {error
                  ? "There was an error loading the user data. Please try again."
                  : "No users have been registered yet."}
              </p>
              <Button variant="outline" disabled={!!error}>
                {error ? "Error" : "Add First User"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Role permissions cards
function RolePermissionsCards() {
  return (
    <div className="gap-4 grid md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 w-5 h-5 text-red-500" />
            Owner
          </CardTitle>
          <CardDescription>
            Full system access and user management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RolePermissionsDisplay role="Owner" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 w-5 h-5 text-blue-500" />
            Admin
          </CardTitle>
          <CardDescription>Limited administrative access</CardDescription>
        </CardHeader>
        <CardContent>
          <RolePermissionsDisplay role="Admin" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 w-5 h-5 text-green-500" />
            Developer
          </CardTitle>
          <CardDescription>Prompt creation and management</CardDescription>
        </CardHeader>
        <CardContent>
          <RolePermissionsDisplay role="Developer" />
        </CardContent>
      </Card>
    </div>
  );
}

export default async function UsersPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Server-side role validation - only Owners can access this page
  const userRole = await getUserRole(session.user.id);
  if (userRole !== "Owner") {
    redirect("/dashboard");
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      {/* Page Header with Three Dots Menu */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-bold text-3xl tracking-tight">Users</h2>
          <p className="text-muted-foreground">
            Manage user accounts and permissions
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="w-4 h-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>User Management</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <UserCheck className="mr-2 w-4 h-4" />
                Bulk Actions
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 w-4 h-4" />
                User Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Shield className="mr-2 w-4 h-4" />
                Permission Audit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* User Stats Cards with loading fallback */}
      <Suspense
        fallback={
          <div className="gap-4 grid md:grid-cols-2 lg:grid-cols-4">
            <UserStatsCardSkeleton />
            <UserStatsCardSkeleton />
          </div>
        }
      >
        <UserStatsCards />
      </Suspense>

      {/* Users Table with loading fallback */}
      <Suspense
        fallback={
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage user accounts and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UserTableSkeleton />
            </CardContent>
          </Card>
        }
      >
        <UsersTableSection currentUserId={session.user.id} />
      </Suspense>

      {/* Role Permissions Cards */}
      <Suspense
        fallback={
          <div className="gap-4 grid md:grid-cols-3">
            <RoleCardSkeleton />
            <RoleCardSkeleton />
            <RoleCardSkeleton />
          </div>
        }
      >
        <RolePermissionsCards />
      </Suspense>
    </div>
  );
}
