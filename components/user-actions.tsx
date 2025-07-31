"use client";

import { useState, useTransition } from "react";
import { Loader2, MoreHorizontal, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { updateUserRole, deleteUser } from "@/actions/user-actions";
import { UserPermissionManager } from "@/components/user-permission-manager";
import { PermissionAudit } from "@/components/permission-audit";
import type { User } from "@/types/user";

interface UserActionsProps {
  user: User;
  currentUserId: string;
  onUserUpdated: () => void;
}

export function UserActions({
  user,
  currentUserId,
  onUserUpdated,
}: UserActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [showPermissions, setShowPermissions] = useState(false);

  const handleRoleUpdate = (newRole: "Owner" | "Admin" | "Developer") => {
    setPendingAction(`role-${newRole}`);
    startTransition(async () => {
      try {
        await updateUserRole(user.id, newRole);
        onUserUpdated();
      } catch (error) {
        console.error("Failed to update role:", error);
        alert("Failed to update user role");
      } finally {
        setPendingAction(null);
      }
    });
  };

  const handleDeleteUser = () => {
    if (
      !confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      return;
    }

    setPendingAction("delete");
    startTransition(async () => {
      try {
        await deleteUser(user.id);
        onUserUpdated();
      } catch (error) {
        console.error("Failed to delete user:", error);
        alert("Failed to delete user");
      } finally {
        setPendingAction(null);
      }
    });
  };

  const isCurrentUser = user.id === currentUserId;
  const isActionPending = isPending || pendingAction !== null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="p-0 w-8 h-8"
          disabled={isActionPending}
        >
          {isActionPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <MoreHorizontal className="w-4 h-4" />
          )}
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <PermissionAudit />
        <DropdownMenuSeparator />

        {!isCurrentUser && (
          <>
            <DropdownMenuLabel className="font-normal text-muted-foreground text-xs">
              Change Role
            </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => handleRoleUpdate("Owner")}
              disabled={isActionPending || user.role === "Owner"}
              className="flex items-center"
            >
              {pendingAction === "role-Owner" && (
                <Loader2 className="mr-2 w-3 h-3 animate-spin" />
              )}
              Owner
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleRoleUpdate("Admin")}
              disabled={isActionPending || user.role === "Admin"}
              className="flex items-center"
            >
              {pendingAction === "role-Admin" && (
                <Loader2 className="mr-2 w-3 h-3 animate-spin" />
              )}
              Admin
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleRoleUpdate("Developer")}
              disabled={isActionPending || user.role === "Developer"}
              className="flex items-center"
            >
              {pendingAction === "role-Developer" && (
                <Loader2 className="mr-2 w-3 h-3 animate-spin" />
              )}
              Developer
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <Dialog open={showPermissions} onOpenChange={setShowPermissions}>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Settings className="mr-2 w-4 h-4" />
                  Manage Permissions
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Manage User Permissions</DialogTitle>
                  <DialogDescription>
                    Grant or revoke individual permissions for this user
                  </DialogDescription>
                </DialogHeader>
                <UserPermissionManager
                  user={user}
                  onPermissionUpdated={onUserUpdated}
                />
              </DialogContent>
            </Dialog>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleDeleteUser}
              disabled={isActionPending}
              className="flex items-center text-red-600"
            >
              {pendingAction === "delete" && (
                <Loader2 className="mr-2 w-3 h-3 animate-spin" />
              )}
              Delete User
            </DropdownMenuItem>
          </>
        )}

        {isCurrentUser && (
          <DropdownMenuItem disabled className="text-muted-foreground">
            Cannot modify your own account
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
