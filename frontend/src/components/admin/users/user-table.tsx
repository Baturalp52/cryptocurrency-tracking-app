"use client";

import { useState, useEffect } from "react";
import { User } from "@/services/auth/types";
import UserRole from "@/enums/user-role";
import UserActions from "./user-actions";
import UserTableHeader from "./user-table-header";
import UserSearchBar from "./user-search-bar";
import { useAuth } from "@/contexts/auth-context";

interface UserTableProps {
  users: User[];
  onBanUser: (userId: string) => Promise<void>;
  onUnbanUser: (userId: string) => Promise<void>;
  onChangeRole: (userId: string, role: UserRole) => Promise<void>;
  onDeleteUser: (userId: string) => Promise<void>;
  isLoading: boolean;
}

// Extend the User type to include status
declare module "@/services/auth/types" {
  interface User {
    status: string;
  }
}

export default function UserTable({
  users,
  onBanUser,
  onUnbanUser,
  onChangeRole,
  onDeleteUser,
  isLoading,
}: UserTableProps) {
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users);
  const [searchTerm, setSearchTerm] = useState("");
  const { user: currentUser } = useAuth();

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(users);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      setFilteredUsers(
        users.filter(
          (user) =>
            user.name.toLowerCase().includes(lowercasedSearch) ||
            user.email.toLowerCase().includes(lowercasedSearch)
        )
      );
    }
  }, [searchTerm, users]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <UserSearchBar onSearch={handleSearch} />

        <div className="table-responsive mt-3">
          <table className="table table-hover align-middle">
            <UserTableHeader />
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span
                        className={`badge ${
                          user.role === UserRole.ADMIN
                            ? "bg-primary"
                            : "bg-secondary"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          user.status === "ACTIVE" ? "bg-success" : "bg-danger"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td>
                      <UserActions
                        user={user}
                        currentUser={currentUser}
                        onBanUser={onBanUser}
                        onUnbanUser={onUnbanUser}
                        onChangeRole={onChangeRole}
                        onDeleteUser={onDeleteUser}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    {searchTerm
                      ? "No users found matching your search."
                      : "No users found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
