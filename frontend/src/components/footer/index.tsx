import Link from "next/link";
import ThemeToggle from "@/components/theme-toggle";
import { AtSign, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-4 mt-4">
      <div className="container">
        <div className="row gy-4">
          <div className="col-12 col-md-6 col-lg-4 text-center text-md-start">
            <h5 className="mb-3">Crypto Tracker</h5>
            <p className="text-muted mb-3">
              Track your favorite cryptocurrencies in real-time.
            </p>
            <div className="d-none d-md-block">
              <ThemeToggle />
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-4">
            <h5 className="mb-3">Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link
                  href="/"
                  className="text-decoration-none d-inline-block py-1"
                >
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  href="/auth/login"
                  className="text-decoration-none d-inline-block py-1"
                >
                  Login
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  href="/auth/signup"
                  className="text-decoration-none d-inline-block py-1"
                >
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-12 col-md-6 col-lg-4">
            <h5 className="mb-3">Contact</h5>
            <ul className="list-unstyled">
              <li className="mb-2 d-flex align-items-center">
                <AtSign className="me-2 w-2 h-2" />
                <span>baturalpsonmez@gmail.com</span>
              </li>
              <li className="mb-2 d-flex align-items-center">
                <Phone className="me-2 w-2 h-2" />
                <span>+90 500 000 00 00</span>
              </li>
            </ul>
          </div>
        </div>
        <hr className="my-4" />
        <div className="text-center">
          <div className="d-md-none mb-3">
            <ThemeToggle />
          </div>
          <p className="mb-0">
            &copy; {new Date().getFullYear()} Crypto Tracker. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
