// Re-export all user action functions
export { hasPermission, getUserWithPermissions } from "./permissions";
export { updateUserRole, deleteUser } from "./user-management";
export { getAllUsers, getUserStats } from "./user-data";

// Backward compatibility
export { getAllUsers as OwnergetAllUsers } from "./user-data";

// Re-export permission constants and types
export {
  PERMISSIONS,
  ROLE_PERMISSIONS,
  type Permission,
  type Role,
} from "@/lib/permissions-config";
