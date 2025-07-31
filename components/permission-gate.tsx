import { PERMISSIONS } from "@/actions/user-actions";

// Permission-based component for restricting UI elements
interface PermissionGateProps {
  permission: string;
  userRole: "Owner" | "Admin" | "Developer";
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PermissionGate({
  permission,
  userRole,
  children,
  fallback = null,
}: PermissionGateProps) {
  // Owners always have all permissions
  if (userRole === "Owner") {
    return <>{children}</>;
  }

  // Check role-based permissions
  const hasPermission = (() => {
    switch (userRole) {
      case "Admin":
        return [PERMISSIONS.VIEW_PROMPTS].includes(permission as any);
      case "Developer":
        return [
          PERMISSIONS.VIEW_PROMPTS,
          PERMISSIONS.CREATE_PROMPTS,
          PERMISSIONS.EDIT_PROMPTS,
          PERMISSIONS.DELETE_PROMPTS,
        ].includes(permission as any);
      default:
        return false;
    }
  })();

  return hasPermission ? <>{children}</> : <>{fallback}</>;
}

// Component to show what permissions a role has
interface RolePermissionsDisplayProps {
  role: "Owner" | "Admin" | "Developer";
}

export function RolePermissionsDisplay({ role }: RolePermissionsDisplayProps) {
  const getPermissions = () => {
    switch (role) {
      case "Owner":
        return Object.values(PERMISSIONS);
      case "Admin":
        return [PERMISSIONS.VIEW_PROMPTS];
      case "Developer":
        return [
          PERMISSIONS.VIEW_PROMPTS,
          PERMISSIONS.CREATE_PROMPTS,
          PERMISSIONS.EDIT_PROMPTS,
          PERMISSIONS.DELETE_PROMPTS,
        ];
      default:
        return [];
    }
  };

  const permissions = getPermissions();

  return (
    <div className="space-y-2">
      <h4 className="font-medium">Permissions for {role}:</h4>
      <ul className="space-y-1 text-gray-600 text-sm list-disc list-inside">
        {permissions.map((permission) => (
          <li key={permission}>
            {permission.replace(/_/g, " ").toLowerCase()}
          </li>
        ))}
      </ul>
    </div>
  );
}
