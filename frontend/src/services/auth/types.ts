import UserRole from "@/enums/user-role";

interface CurrentUserResponse {
  user: User;
}
interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthResponse {
  user: User;
  token: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export type {
  CurrentUserResponse,
  User,
  AuthResponse,
  LoginCredentials,
  SignupData,
};
