"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import * as authService from "@/services/auth";
import { User } from "@/services/auth/types";
import { setCookie, getCookie, removeCookie } from "@/utils/cookies";
import { TOKEN_COOKIE_NAME, COOKIE_EXPIRATION_DAYS } from "@/utils/constants";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
type AuthProviderProps = {
  children: React.ReactNode;
  initialUser: User | null;
};

export function AuthProvider({ children, initialUser }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUserResponse = await authService.getCurrentUser();
      setUser(currentUserResponse.user);
    };

    // Check if user is logged in from cookies
    const token = getCookie(TOKEN_COOKIE_NAME);

    if (token) {
      try {
        fetchUser();
      } catch {
        removeCookie(TOKEN_COOKIE_NAME);
      }
    }

    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.login({ email, password });

      // Save token to cookie
      setCookie(TOKEN_COOKIE_NAME, response.token, COOKIE_EXPIRATION_DAYS);

      setUser(response.user);
      setLoading(false);
      return true;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : typeof err === "object" &&
            err !== null &&
            "response" in err &&
            err.response &&
            typeof err.response === "object" &&
            "data" in err.response &&
            err.response.data &&
            typeof err.response.data === "object" &&
            "message" in err.response.data &&
            typeof err.response.data.message === "string"
          ? err.response.data.message
          : "Login failed. Please check your credentials.";

      setError(errorMessage);
      setLoading(false);
      return false;
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.signup({
        name,
        email,
        password,
        password_confirmation: password,
      });

      // Save token to cookie
      setCookie(TOKEN_COOKIE_NAME, response.token, COOKIE_EXPIRATION_DAYS);

      setUser(response.user);
      setLoading(false);
      return true;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : typeof err === "object" &&
            err !== null &&
            "response" in err &&
            err.response &&
            typeof err.response === "object" &&
            "data" in err.response &&
            err.response.data &&
            typeof err.response.data === "object" &&
            "message" in err.response.data &&
            typeof err.response.data.message === "string"
          ? err.response.data.message
          : "Signup failed. Please try again.";

      setError(errorMessage);
      setLoading(false);
      return false;
    }
  };

  const logout = async () => {
    setLoading(true);

    try {
      await authService.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // Clear user data regardless of API success
      setUser(null);
      removeCookie(TOKEN_COOKIE_NAME);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, signup, logout, error }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
