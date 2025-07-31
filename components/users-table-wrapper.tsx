"use client";

import { UsersTable } from "@/components/users-table";
import type { User } from "@/types/user";
import { useRouter } from "next/navigation";

interface UsersTableWrapperProps {
  users: User[];
  currentUserId: string;
}

export function UsersTableWrapper({
  users,
  currentUserId,
}: UsersTableWrapperProps) {
  const router = useRouter();

  const handleUserUpdated = () => {
    router.refresh();
  };

  return (
    <UsersTable
      users={users}
      currentUserId={currentUserId}
      onUserUpdated={handleUserUpdated}
    />
  );
}
