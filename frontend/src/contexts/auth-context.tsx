"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (_) {
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, _password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call to backend
      // This is a mock implementation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock successful login
      const mockUser = {
        id: "1",
        email,
        name: "User",
      };

      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
      setLoading(false);
      return true;
    } catch (_error) {
      setError("Login failed. Please check your credentials.");
      setLoading(false);
      return false;
    }
  };

  const signup = async (
    name: string,
    email: string,
    _password: string
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call to backend
      // This is a mock implementation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock successful signup
      const mockUser = {
        id: "1",
        email,
        name,
      };

      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
      setLoading(false);
      return true;
    } catch (_error) {
      setError("Signup failed. Please try again.");
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
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
