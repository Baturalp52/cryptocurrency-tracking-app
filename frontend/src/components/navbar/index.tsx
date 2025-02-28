"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    const navbarToggler = document.querySelector(
      ".navbar-toggler"
    ) as HTMLElement;
    const handleClick = () => {
      if (!navbarToggler) return;
      if (navbarToggler.getAttribute("aria-expanded") === "true") {
        navbarToggler.click();
      }
    };
    document.body.addEventListener("click", handleClick);
    return () => {
      document.body.removeEventListener("click", handleClick);
    };
  }, [pathname]);

  return (
    <nav className="navbar navbar-expand-lg sticky-top">
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
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link
                href="/"
                className={`nav-link ${pathname === "/" ? "active" : ""}`}
              >
                Home
              </Link>
            </li>
            {user && (
              <li className="nav-item">
                <Link
                  href="/watchlist"
                  className={`nav-link ${
                    pathname === "/watchlist" ? "active" : ""
                  }`}
                >
                  Watchlist
                </Link>
              </li>
            )}
          </ul>

          <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center gap-2">
            {loading ? (
              <span className="navbar-text">Loading...</span>
            ) : user ? (
              <>
                <span className="navbar-text me-lg-3 mb-2 mb-lg-0">
                  Welcome, {user.name}
                </span>
                <button
                  className="btn btn-outline-primary w-100 w-lg-auto"
                  onClick={logout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className={`btn ${
                    pathname === "/auth/login"
                      ? "btn-primary"
                      : "btn-outline-primary"
                  } mb-2 mb-lg-0 w-100 w-md-auto`}
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className={`btn ${
                    pathname === "/auth/signup"
                      ? "btn-primary"
                      : "btn-outline-primary"
                  } w-100 w-md-auto mb-lg-0 mb-2 text-nowrap`}
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
