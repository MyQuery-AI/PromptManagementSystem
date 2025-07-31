"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { User } from "@/types/user";
import { UserActions } from "@/components/user-actions";

interface UsersTableProps {
  users: User[];
  currentUserId?: string;
  onUserUpdated?: () => void;
}

export function UsersTable({
  users,
  currentUserId,
  onUserUpdated,
}: UsersTableProps) {
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "Owner":
        return "destructive";
      case "Admin":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
    }
    return email[0].toUpperCase();
  };

  if (users.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 text-center">
        <div>
          <h3 className="mb-2 font-semibold text-gray-900 text-lg">
            No Users Found
          </h3>
          <p className="text-gray-600">No users have been registered yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs">
                      {getInitials(user.name, user.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.name || "No name"}</div>
                    <div className="text-muted-foreground text-sm">
                      {user.email}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={getRoleBadgeVariant(user.role)}>
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">Active</Badge>
              </TableCell>
              <TableCell className="text-right">
                {currentUserId && onUserUpdated && (
                  <UserActions
                    user={user}
                    currentUserId={currentUserId}
                    onUserUpdated={onUserUpdated}
                  />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
