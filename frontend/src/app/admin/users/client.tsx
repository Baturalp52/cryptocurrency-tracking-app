"use client";

import { useState } from "react";
import { User } from "@/services/auth/types";
import UserRole from "@/enums/user-role";
import UserTable from "@/components/admin/users/user-table";
import {
  banUser,
  unbanUser,
  updateUserRole,
  deleteUser,
} from "@/services/admin/users";

interface UserManagementProps {
  initialUsers: User[];
}

export default function UserManagement({ initialUsers }: UserManagementProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isLoading, setIsLoading] = useState(false);

  // User management actions
  const handleBanUser = async (userId: string) => {
    try {
      setIsLoading(true);
      await banUser(userId);
      setUsers(
        users.map((u) => (u.id === userId ? { ...u, status: "BANNED" } : u))
      );
      // TODO: Add toast notification for success
    } catch (error) {
      console.error("Failed to ban user:", error);
      // TODO: Add toast notification for error
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnbanUser = async (userId: string) => {
    try {
      setIsLoading(true);
      await unbanUser(userId);
      setUsers(
        users.map((u) => (u.id === userId ? { ...u, status: "ACTIVE" } : u))
      );
      // TODO: Add toast notification for success
    } catch (error) {
      console.error("Failed to unban user:", error);
      // TODO: Add toast notification for error
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeRole = async (userId: string, role: UserRole) => {
    try {
      setIsLoading(true);
      await updateUserRole(userId, role);
      setUsers(users.map((u) => (u.id === userId ? { ...u, role } : u)));
      // TODO: Add toast notification for success
    } catch (error) {
      console.error("Failed to update user role:", error);
      // TODO: Add toast notification for error
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      setIsLoading(true);
      await deleteUser(userId);
      setUsers(users.filter((u) => u.id !== userId));
      // TODO: Add toast notification for success
    } catch (error) {
      console.error("Failed to delete user:", error);
      // TODO: Add toast notification for error
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UserTable
      users={users}
      onBanUser={handleBanUser}
      onUnbanUser={handleUnbanUser}
      onChangeRole={handleChangeRole}
      onDeleteUser={handleDeleteUser}
      isLoading={isLoading}
    />
  );
}
