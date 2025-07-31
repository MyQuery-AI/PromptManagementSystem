"use client";

import { useState, useTransition, useEffect } from "react";
import { Check, X, Plus, Minus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PERMISSIONS, ROLE_PERMISSIONS } from "@/lib/permissions-config";
import {
  grantPermissionToUser,
  revokePermissionFromUser,
  revokeAnyPermissionFromUser,
  getUserAllPermissions,
} from "@/actions/user-actions/permission-grants";
import type { User } from "@/types/user";

interface UserPermissionManagerProps {
  user: User;
  onPermissionUpdated?: () => void;
}

export function UserPermissionManager({
  user,
  onPermissionUpdated,
}: UserPermissionManagerProps) {
  const [isPending, startTransition] = useTransition();
  const [userPermissions, setUserPermissions] = useState<{
    rolePermissions: readonly string[];
    individualPermissions: string[];
    allPermissions: string[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-load permissions when component mounts or user changes
  useEffect(() => {
    loadUserPermissions();
  }, [user.id, user.role]); // Reload when user ID or role changes

  // Load user permissions
  const loadUserPermissions = async () => {
    setIsLoading(true);
    try {
      const permissions = await getUserAllPermissions(user.id);
      setUserPermissions(permissions);
    } catch (error) {
      console.error("Failed to load permissions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Grant permission
  const handleGrantPermission = (permission: string) => {
    startTransition(async () => {
      try {
        await grantPermissionToUser(user.id, permission as any);
        await loadUserPermissions();
        onPermissionUpdated?.();
      } catch (error) {
        console.error("Failed to grant permission:", error);
        alert("Failed to grant permission");
      }
    });
  };

  // Revoke any permission (role-based or individual)
  const handleRevokePermission = (permission: string) => {
    startTransition(async () => {
      try {
        await revokeAnyPermissionFromUser(user.id, permission as any);
        await loadUserPermissions();
        onPermissionUpdated?.();
      } catch (error) {
        console.error("Failed to revoke permission:", error);
        alert("Failed to revoke permission");
      }
    });
  };

  // Get role-based permissions for this user
  const rolePermissions =
    user.role === "Owner"
      ? Object.values(PERMISSIONS)
      : ROLE_PERMISSIONS[user.role] || [];

  const availablePermissions = Object.values(PERMISSIONS);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Permission Management
          <Button
            variant="outline"
            size="sm"
            onClick={loadUserPermissions}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Load Permissions"
            )}
          </Button>
        </CardTitle>
        <CardDescription>
          Manage individual permissions for {user.name || user.email}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Current Role */}
          <div>
            <h4 className="mb-2 font-medium">Current Role</h4>
            <Badge variant="secondary">{user.role}</Badge>
            <p className="mt-1 text-muted-foreground text-sm">
              Role-based permissions are automatically granted
            </p>
          </div>

          {/* Role-based Permissions */}
          <div>
            <h4 className="mb-3 font-medium">Role-Based Permissions</h4>
            <div className="gap-2 grid grid-cols-1">
              {rolePermissions.map((permission) => (
                <div
                  key={permission}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">{permission}</span>
                    <Badge variant="outline" className="text-xs">
                      Role
                    </Badge>
                  </div>
                  {/* Allow removal of role-specific permissions */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRevokePermission(permission)}
                    disabled={isPending}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Individual Permissions */}
          {userPermissions && (
            <div>
              <h4 className="mb-3 font-medium">Individual Permissions</h4>
              {userPermissions.individualPermissions.length > 0 ? (
                <div className="gap-2 grid grid-cols-1">
                  {userPermissions.individualPermissions.map((permission) => (
                    <div
                      key={permission}
                      className="flex justify-between items-center"
                    >
                      <div className="flex items-center space-x-2">
                        <Plus className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">{permission}</span>
                        <Badge variant="outline" className="text-xs">
                          Individual
                        </Badge>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRevokePermission(permission)}
                        disabled={isPending}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  No individual permissions granted
                </p>
              )}
            </div>
          )}

          {/* Grant New Permissions */}
          <div>
            <h4 className="mb-3 font-medium">Grant Additional Permissions</h4>
            <div className="gap-2 grid grid-cols-1">
              {availablePermissions
                .filter(
                  (permission) =>
                    !(rolePermissions as string[]).includes(permission)
                )
                .filter(
                  (permission) =>
                    !userPermissions?.individualPermissions.includes(permission)
                )
                .map((permission) => (
                  <div
                    key={permission}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center space-x-2">
                      <X className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{permission}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleGrantPermission(permission)}
                      disabled={isPending}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
