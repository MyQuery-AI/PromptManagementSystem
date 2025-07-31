# User Actions File Structure

This document describes the reorganized file structure for user actions to fix the "use server" error and improve code organization.

## New File Structure

### `/lib/permissions-config.ts`

- **Purpose**: Contains permission constants and role definitions
- **Exports**:
  - `PERMISSIONS` object with all permission constants
  - `ROLE_PERMISSIONS` mapping roles to their permissions
  - `Permission` and `Role` types
- **No "use server"**: This file only contains constants and types

### `/actions/user-actions/permissions.ts`

- **Purpose**: Permission checking functions
- **Exports**:
  - `hasPermission()` - Check if user has specific permission
  - `getUserWithPermissions()` - Get user with permission info
- **"use server"**: Contains only async functions

### `/actions/user-actions/user-management.ts`

- **Purpose**: User role and account management functions
- **Exports**:
  - `updateUserRole()` - Change user roles (Owner only)
  - `deleteUser()` - Delete users (Owner only)
- **"use server"**: Contains only async functions

### `/actions/user-actions/user-data.ts`

- **Purpose**: User data retrieval functions
- **Exports**:
  - `getAllUsers()` - Get all users (Owner only)
  - `getUserStats()` - Get user statistics (Owner only)
- **"use server"**: Contains only async functions

### `/actions/user-actions/index.ts`

- **Purpose**: Central export point for all user actions
- **Exports**: Re-exports all functions from other modules
- **Backward Compatibility**: Exports `OwnergetAllUsers` as alias for `getAllUsers`
- **No "use server"**: Only contains exports

### `/actions/user-actions/user-actions.ts`

- **Purpose**: Backward compatibility
- **Exports**: Re-exports everything from index.ts
- **Maintains**: Old function names for existing code

## Benefits

1. **Fixed "use server" Error**: No objects/constants in "use server" files
2. **Better Organization**: Functions grouped by purpose
3. **Improved Readability**: Smaller, focused files
4. **Type Safety**: Centralized type definitions
5. **Backward Compatibility**: Existing imports still work
6. **Maintainability**: Easier to find and modify specific functionality

## Migration Guide

### Old Import (still works):

```typescript
import {
  hasPermission,
  PERMISSIONS,
} from "@/actions/user-actions/user-actions";
```

### New Import (recommended):

```typescript
import { hasPermission } from "@/actions/user-actions";
import { PERMISSIONS } from "@/lib/permissions-config";
```

### Or use the index:

```typescript
import { hasPermission, PERMISSIONS } from "@/actions/user-actions";
```

## Permission System

- **Owner**: Full access to all permissions
- **Admin**: Limited access (VIEW_PROMPTS only)
- **Developer**: Prompt management permissions
- **Consistent**: All Owners have identical permissions
- **Secure**: Server-side validation for all actions
