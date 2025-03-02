"use client";

import { useTheme } from "@/contexts/theme-context";
import { Moon, Sun, Laptop } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="btn-group" role="group" aria-label="Theme toggle">
      <input
        type="radio"
        className="btn-check"
        name="theme-options"
        id="theme-system"
        checked={theme === "system" || !theme}
        onChange={() => setTheme("system")}
        autoComplete="off"
      />
      <label
        className={`btn btn-outline-primary d-flex align-items-center gap-2 ${
          theme === "system" || !theme ? "active" : ""
        }`}
        htmlFor="theme-system"
      >
        <Laptop size={16} />
        <span className="d-none d-sm-inline">System</span>
      </label>

      <input
        type="radio"
        className="btn-check"
        name="theme-options"
        id="theme-light"
        checked={theme === "light"}
        onChange={() => setTheme("light")}
        autoComplete="off"
      />
      <label
        className={`btn btn-outline-primary d-flex align-items-center gap-2 ${
          theme === "light" ? "active" : ""
        }`}
        htmlFor="theme-light"
      >
        <Sun size={16} />
        <span className="d-none d-sm-inline">Light</span>
      </label>

      <input
        type="radio"
        className="btn-check"
        name="theme-options"
        id="theme-dark"
        checked={theme === "dark"}
        onChange={() => setTheme("dark")}
        autoComplete="off"
      />
      <label
        className={`btn btn-outline-primary d-flex align-items-center gap-2 ${
          theme === "dark" ? "active" : ""
        }`}
        htmlFor="theme-dark"
      >
        <Moon size={16} />
        <span className="d-none d-sm-inline">Dark</span>
      </label>
    </div>
  );
}
