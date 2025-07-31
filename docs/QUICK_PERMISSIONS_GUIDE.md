# Quick Guide: How to Give Permissions

## 🎯 **Simple 3-Step Process**

### Step 1: Login as Owner

- Only **Owners** can change user permissions
- Make sure you're logged in with an Owner account

### Step 2: Go to Users Page

- Navigate to `/users` in your application
- You'll see a table with all users

### Step 3: Change User Role

- Find the user you want to modify
- Click the **⋯** (three dots) button in the Actions column
- Select one of these options:

## 🎛️ **Permission Options**

### 🔴 **Make Owner**

**Full System Control**

- ✅ Manage all users
- ✅ Change user roles
- ✅ Delete users
- ✅ Full prompt management
- ✅ System administration

**Use when:** Someone needs complete system access

### 🔵 **Make Admin**

**View Only Access**

- ✅ View prompts only
- ❌ Cannot manage users
- ❌ Cannot create/edit prompts

**Use when:** Someone needs read-only access

### 🟢 **Make Developer**

**Content Management**

- ✅ View all prompts
- ✅ Create new prompts
- ✅ Edit existing prompts
- ✅ Delete prompts
- ❌ Cannot manage users

**Use when:** Someone needs to work with prompts but not manage users

## 📋 **Example Scenarios**

### New Team Member

```
1. User registers → Gets "Developer" role by default
2. Owner goes to /users page
3. Clicks ⋯ → "Make Admin" (if they only need to view)
   OR
   Clicks ⋯ → "Make Developer" (if they need to create prompts)
```

### Promoting Someone to Manager

```
1. Owner goes to /users page
2. Finds the user
3. Clicks ⋯ → "Make Owner"
4. User now has full system access
```

### Restricting Access

```
1. Owner goes to /users page
2. Finds the user with too much access
3. Clicks ⋯ → "Make Admin" (for view-only)
```

### Removing Someone

```
1. Owner goes to /users page
2. Finds the user to remove
3. Clicks ⋯ → "Delete User"
4. User account is permanently deleted
```

## ⚠️ **Important Notes**

- **You cannot delete yourself** - System prevents self-deletion
- **Changes take effect immediately** - User will see new permissions on next action
- **No custom permissions** - Only the 3 predefined roles available
- **All Owners are equal** - Every Owner has identical permissions

## 🚨 **Emergency Access**

If you lose Owner access, you'll need to:

1. Access the database directly
2. Update the user's role to "Owner" in the database:

```sql
UPDATE users SET role = 'Owner' WHERE email = 'your-email@example.com';
```

## 🔍 **How to Check Current Permissions**

Users can see their current role on the Users page:

- **Red badge** = Owner
- **Blue badge** = Admin
- **Gray badge** = Developer

The page also shows what permissions each role has in the role cards below the user table.
