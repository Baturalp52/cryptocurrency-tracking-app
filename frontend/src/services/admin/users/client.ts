import api from "../../api";
import UserRole from "@/enums/user-role";
import {
  MessageResponse,
  RoleUpdateRequest,
  UserResponse,
  UsersResponse,
} from "./types";

/**
 * Get all users
 */
export const getUsers = async (): Promise<UsersResponse> => {
  const response = await api.get<UsersResponse>("/admin/users");
  return response.data;
};

/**
 * Ban a user
 */
export const banUser = async (userId: string): Promise<MessageResponse> => {
  const response = await api.post<MessageResponse>(
    `/admin/users/${userId}/ban`
  );
  return response.data;
};

/**
 * Unban a user
 */
export const unbanUser = async (userId: string): Promise<MessageResponse> => {
  const response = await api.post<MessageResponse>(
    `/admin/users/${userId}/unban`
  );
  return response.data;
};

/**
 * Update a user's role
 */
export const updateUserRole = async (
  userId: string,
  role: UserRole
): Promise<UserResponse> => {
  const data: RoleUpdateRequest = { role };
  const response = await api.put<UserResponse>(
    `/admin/users/${userId}/role`,
    data
  );
  return response.data;
};

/**
 * Delete a user
 */
export const deleteUser = async (userId: string): Promise<MessageResponse> => {
  const response = await api.delete<MessageResponse>(`/admin/users/${userId}`);
  return response.data;
};
