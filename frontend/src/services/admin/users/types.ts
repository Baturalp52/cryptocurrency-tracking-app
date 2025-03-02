import { User } from "../../auth/types";
import UserRole from "@/enums/user-role";

export interface UsersResponse {
  users: User[];
}

export interface UserResponse {
  user: User;
  message: string;
}

export interface MessageResponse {
  message: string;
}

export interface RoleUpdateRequest {
  role: UserRole;
}
