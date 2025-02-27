"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link href="/" className="navbar-brand">
          Crypto Tracker
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link
                href="/"
                className={`nav-link ${pathname === "/" ? "active" : ""}`}
              >
                Home
              </Link>
            </li>
            {/* Add more navigation items here */}
          </ul>

          <div className="d-flex">
            {user ? (
              <>
                <span className="navbar-text me-3">Welcome, {user.name}</span>
                <button className="btn btn-outline-light" onClick={logout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className={`btn ${
                    pathname === "/auth/login"
                      ? "btn-light"
                      : "btn-outline-light"
                  } me-2`}
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className={`btn ${
                    pathname === "/auth/signup"
                      ? "btn-light"
                      : "btn-outline-light"
                  }`}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
