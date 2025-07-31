# How to Give Permissions

This guide explains how permissions work in the system and how to manage user permissions.

## Permission System Overview

The system uses a **role-based permission system** where permissions are tied to user roles, not individual users. This ensures consistency and prevents permission variations between users of the same role.

## Available Roles and Their Permissions

### 🔴 **Owner** (Highest Authority)

- `MANAGE_USERS` - Add, remove, and manage users
- `MANAGE_USER_ROLES` - Change user roles
- `VIEW_PROMPTS` - View all prompts
- `CREATE_PROMPTS` - Create new prompts
- `EDIT_PROMPTS` - Edit existing prompts
- `DELETE_PROMPTS` - Delete prompts
- `MANAGE_SYSTEM` - System administration

### 🔵 **Admin** (Limited Authority)

- `VIEW_PROMPTS` - View all prompts only

### 🟢 **Developer** (Content Management)

- `VIEW_PROMPTS` - View all prompts
- `CREATE_PROMPTS` - Create new prompts
- `EDIT_PROMPTS` - Edit existing prompts
- `DELETE_PROMPTS` - Delete prompts

## How to Give Permissions

### Method 1: Through the UI (Recommended)

1. **Login as Owner** - Only Owners can manage user roles
2. **Go to Users Page** - Navigate to `/users`
3. **Find the User** - Locate the user you want to modify
4. **Click Actions Menu** - Click the three dots (⋯) next to the user
5. **Select Role** - Choose from:
   - "Make Owner" - Gives full system access
   - "Make Admin" - Gives limited view access
   - "Make Developer" - Gives prompt management access

### Method 2: Programmatically

```typescript
import { updateUserRole } from "@/actions/user-actions";

// Example: Make a user an Admin
await updateUserRole("user-id-here", "Admin");

// Example: Make a user a Developer
await updateUserRole("user-id-here", "Developer");

// Example: Make a user an Owner
await updateUserRole("user-id-here", "Owner");
```

### Method 3: Direct Database (Advanced)

```sql
-- Update user role directly in database
UPDATE users SET role = 'Owner' WHERE email = 'user@example.com';
UPDATE users SET role = 'Admin' WHERE email = 'user@example.com';
UPDATE users SET role = 'Developer' WHERE email = 'user@example.com';
```

## Permission Checking

### In Server Components/Actions

```typescript
import { hasPermission, PERMISSIONS } from "@/actions/user-actions";

// Check if current user can manage users
const canManageUsers = await hasPermission(userId, PERMISSIONS.MANAGE_USERS);

if (canManageUsers) {
  // User has permission to manage users
}
```

### In Client Components

```typescript
import { PermissionGate } from "@/components/permission-gate";

function SomeComponent({ userRole }: { userRole: Role }) {
  return (
    <PermissionGate
      permission={PERMISSIONS.CREATE_PROMPTS}
      userRole={userRole}
    >
      <button>Create Prompt</button>
    </PermissionGate>
  );
}
```

### Using Permission Manager

```typescript
import { PermissionManager } from "@/lib/permissions";

// Check permissions server-side
const canManage = await PermissionManager.canManageUsers();
const canViewPrompts = await PermissionManager.canViewPrompts();
const userRole = await PermissionManager.getCurrentUserRole();
```

## Security Rules

### 🔒 **Key Security Features:**

1. **Owner-Only Management**: Only Owners can change user roles
2. **Self-Protection**: Users cannot delete their own accounts
3. **Server-Side Validation**: All permission checks happen on the server
4. **Consistent Permissions**: All users of the same role have identical permissions
5. **Role Hierarchy**: Owner > Admin > Developer

### 🚫 **Restrictions:**

- **Cannot** give individual permissions to users
- **Cannot** create custom roles (only Owner, Admin, Developer)
- **Cannot** have Owners with different permission sets
- **Cannot** bypass role-based permissions

## Common Use Cases

### Making Someone a Content Manager

```typescript
// Give them Developer role for full prompt management
await updateUserRole(userId, "Developer");
```

### Making Someone a System Administrator

```typescript
// Give them Owner role for full system access
await updateUserRole(userId, "Owner");
```

### Limiting Someone's Access

```typescript
// Give them Admin role for view-only access
await updateUserRole(userId, "Admin");
```

### Removing Access

```typescript
// Delete the user account (Owner only)
await deleteUser(userId);
```

## API Routes Protection

### Protect API endpoints with permissions:

```typescript
import { createProtectedHandler } from "@/lib/api-protection";
import { PERMISSIONS } from "@/lib/permissions-config";

// Only users with MANAGE_USERS permission can access
export const { GET, POST } = createProtectedHandler(PERMISSIONS.MANAGE_USERS, {
  GET: async (req) => {
    // Handler logic
  },
  POST: async (req) => {
    // Handler logic
  },
});
```

## Best Practices

1. **Start with Minimal Permissions**: Give users the least access they need
2. **Use Role Hierarchy**: Owner → Admin → Developer
3. **Regular Audits**: Review user roles periodically
4. **Document Changes**: Keep track of permission changes
5. **Test Permissions**: Verify permissions work as expected

## Troubleshooting

### User Can't Access Feature

1. Check user's role: `PermissionManager.getCurrentUserRole()`
2. Verify role has required permission
3. Check UI permission gates
4. Verify server-side validation

### Permission Denied Errors

1. Ensure user is authenticated
2. Check if user has required role
3. Verify Owner status for management operations
4. Check session validity

## Example Workflow

```typescript
// 1. Get current user's permissions
const userRole = await PermissionManager.getCurrentUserRole();

// 2. Check specific permission
const canCreatePrompts = await PermissionManager.checkPermission(
  PERMISSIONS.CREATE_PROMPTS
);

// 3. Update user role (if authorized)
if (userRole === "Owner") {
  await updateUserRole(targetUserId, "Developer");
}

// 4. Display UI based on permissions
<PermissionGate permission={PERMISSIONS.MANAGE_USERS} userRole={userRole}>
  <UserManagementPanel />
</PermissionGate>
```

This role-based system ensures security, consistency, and ease of management while preventing permission confusion or security holes.
