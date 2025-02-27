"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Function to safely check if we're in a browser environment
const isBrowser = typeof window !== "undefined";

// Function to get system theme preference
const getSystemTheme = (): "light" | "dark" => {
  if (!isBrowser) return "light"; // Default for SSR
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

// Function to get initial theme from localStorage or use system
const getInitialTheme = (): Theme => {
  if (!isBrowser) return "system"; // Default for SSR
  try {
    const storedTheme = localStorage.getItem("theme") as Theme | null;
    return storedTheme || "system";
  } catch (e) {
    // In case localStorage is not available
    console.error("Error accessing localStorage:", e);
    return "system";
  }
};

// Function to get initial resolved theme
const getInitialResolvedTheme = (): "light" | "dark" => {
  if (!isBrowser) return "light"; // Default for SSR

  // First check if theme is already applied to document
  const dataTheme = document.documentElement.getAttribute("data-bs-theme");
  if (dataTheme === "light" || dataTheme === "dark") {
    return dataTheme;
  }

  try {
    const initialTheme = getInitialTheme();
    return initialTheme === "system"
      ? getSystemTheme()
      : (initialTheme as "light" | "dark");
  } catch (e) {
    // In case of any errors
    console.error("Error resolving theme:", e);
    return "light";
  }
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Initialize with default values for SSR
  const [theme, setTheme] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  // This effect runs only once on client-side to set the initial state
  useEffect(() => {
    setTheme(getInitialTheme());
    setResolvedTheme(getInitialResolvedTheme());
  }, []);

  // Apply theme only on client-side
  useEffect(() => {
    // Apply the resolved theme to the document
    document.documentElement.setAttribute("data-bs-theme", resolvedTheme);

    // Set up listener for system theme changes if using system theme
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => {
        const newSystemTheme = getSystemTheme();
        setResolvedTheme(newSystemTheme);
        document.documentElement.setAttribute("data-bs-theme", newSystemTheme);
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme, resolvedTheme]);

  // Handle theme changes
  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);

    try {
      // Update resolved theme and apply it immediately
      const newResolvedTheme =
        newTheme === "system" ? getSystemTheme() : newTheme;
      setResolvedTheme(newResolvedTheme);
      document.documentElement.setAttribute("data-bs-theme", newResolvedTheme);

      // Store theme preference in localStorage
      localStorage.setItem("theme", newTheme);
    } catch (e) {
      console.error("Error setting theme:", e);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme: handleThemeChange,
        resolvedTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
