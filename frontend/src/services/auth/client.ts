import api from "../api";
import {
  LoginCredentials,
  SignupData,
  AuthResponse,
  CurrentUserResponse,
} from "./types";
/**
 * Login a user with email and password
 */
export const login = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/login", credentials);
  return response.data;
};

/**
 * Register a new user
 */
export const signup = async (userData: SignupData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/register", userData);
  return response.data;
};

/**
 * Get the current authenticated user
 */
export const getCurrentUser = async (): Promise<CurrentUserResponse> => {
  const response = await api.get<CurrentUserResponse>("/user");
  return response.data;
};

/**
 * Logout the current user
 */
export const logout = async (): Promise<void> => {
  await api.post("/logout");
};
