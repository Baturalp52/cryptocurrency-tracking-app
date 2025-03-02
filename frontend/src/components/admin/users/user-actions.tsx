"use client";

import { useState } from "react";
import { User } from "@/services/auth/types";
import UserRole from "@/enums/user-role";
import { MoreVertical, Shield, UserX, Trash2, UserCheck } from "lucide-react";
import { Popover } from "react-tiny-popover";

// Ensure User type has status property
declare module "@/services/auth/types" {
  interface User {
    status: string;
  }
}

interface UserActionsProps {
  user: User;
  currentUser: User | null;
  onBanUser: (userId: string) => Promise<void>;
  onUnbanUser: (userId: string) => Promise<void>;
  onChangeRole: (userId: string, role: UserRole) => Promise<void>;
  onDeleteUser: (userId: string) => Promise<void>;
}

export default function UserActions({
  user,
  currentUser,
  onBanUser,
  onUnbanUser,
  onChangeRole,
  onDeleteUser,
}: UserActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // Prevent actions on current user
  const isSelf = currentUser?.id === user.id;

  // Determine if user is admin or banned
  const isAdmin = user.role === UserRole.ADMIN;
  const isBanned = user.status === "BANNED";

  const handleAction = async (action: () => Promise<void>) => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      await action();
      setIsPopoverOpen(false); // Close popover after action
    } catch (error) {
      console.error("Action failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Popover
      isOpen={isPopoverOpen}
      positions={["bottom", "left"]}
      onClickOutside={() => setIsPopoverOpen(false)}
      content={
        <div className="card shadow-sm border-0" style={{ minWidth: "200px" }}>
          <div className="list-group list-group-flush">
            {/* Role change action */}
            <button
              className="list-group-item list-group-item-action d-flex align-items-center gap-2"
              onClick={() =>
                handleAction(() =>
                  onChangeRole(
                    user.id,
                    isAdmin ? ("MEMBER" as UserRole) : UserRole.ADMIN
                  )
                )
              }
              disabled={isSelf}
            >
              <Shield size={16} />
              {isAdmin ? "Make Member" : "Make Admin"}
            </button>

            {/* Ban/Unban action */}
            <button
              className="list-group-item list-group-item-action d-flex align-items-center gap-2"
              onClick={() =>
                handleAction(() =>
                  isBanned ? onUnbanUser(user.id) : onBanUser(user.id)
                )
              }
              disabled={isSelf}
            >
              {isBanned ? <UserCheck size={16} /> : <UserX size={16} />}
              {isBanned ? "Unban User" : "Ban User"}
            </button>

            {/* Delete action */}
            <button
              className="list-group-item list-group-item-action d-flex align-items-center gap-2 text-danger"
              onClick={() => handleAction(() => onDeleteUser(user.id))}
              disabled={isSelf}
            >
              <Trash2 size={16} />
              Delete User
            </button>
          </div>
        </div>
      }
    >
      <button
        className="btn btn-sm border-0 shadow-none"
        type="button"
        onClick={() =>
          !isSelf && !isLoading && setIsPopoverOpen(!isPopoverOpen)
        }
        disabled={isSelf || isLoading}
      >
        {isLoading ? (
          <span
            className="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
        ) : (
          <MoreVertical size={16} />
        )}
      </button>
    </Popover>
  );
}
