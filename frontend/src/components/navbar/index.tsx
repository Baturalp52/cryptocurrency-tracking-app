"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import SearchModal from "../search/search-modal";
import { Search } from "lucide-react";

// Define navigation links as constants
const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/cryptocurrencies", label: "Cryptocurrencies" },
];

// Define auth links as constants
const AUTH_LINKS = [
  { href: "/auth/login", label: "Login" },
  { href: "/auth/signup", label: "Sign Up" },
];

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

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

  // Define user-specific links
  const USER_LINKS = [{ href: "/watchlists", label: "Watchlists" }];

  return (
    <>
      <nav className="navbar navbar-expand-lg sticky-top">
        <div className="container">
          <Link href="/" className="navbar-brand">
            Crypto Tracker
          </Link>

          <div className="d-flex d-md-none align-items-center">
            <button
              className="btn"
              onClick={() => setIsSearchModalOpen(true)}
              aria-label="Search"
            >
              <Search size={20} />
            </button>

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
          </div>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {NAV_LINKS.map((link) => (
                <li className="nav-item" key={link.href}>
                  <Link
                    href={link.href}
                    className={`nav-link ${
                      pathname === link.href ? "active" : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {user &&
                USER_LINKS.map((link) => (
                  <li className="nav-item" key={link.href}>
                    <Link
                      href={link.href}
                      className={`nav-link ${
                        pathname === link.href ? "active" : ""
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
            </ul>

            <button
              className="btn btn-sm btn-dark border-0 d-none d-md-flex align-items-center me-2"
              onClick={() => setIsSearchModalOpen(true)}
              aria-label="Search"
            >
              <Search size={20} />
              <span className="d-none d-md-inline ms-2 fw-medium">Search</span>
            </button>
            <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center gap-2">
              {loading ? (
                <span className="navbar-text">Loading...</span>
              ) : user ? (
                <>
                  <span className="navbar-text me-lg-3 mb-2 mb-lg-0 text-nowrap">
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
                  {AUTH_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`btn ${
                        pathname === link.href
                          ? "btn-primary"
                          : "btn-outline-primary"
                      } ${
                        link.href === "/auth/login"
                          ? "mb-2 mb-lg-0 w-100 w-md-auto"
                          : "w-100 w-md-auto mb-lg-0 mb-2 text-nowrap"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </>
  );
}
