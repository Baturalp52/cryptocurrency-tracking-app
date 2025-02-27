import Link from "next/link";
import ThemeToggle from "@/components/theme-toggle";

export default function Footer() {
  return (
    <footer className="py-4 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h5>Cryptocurrency Tracking App</h5>
            <p className="text-muted">
              Track your favorite cryptocurrencies in real-time.
            </p>
          </div>
          <div className="col-md-3">
            <h5>Links</h5>
            <ul className="list-unstyled">
              <li>
                <Link href="/" className="text-decoration-none">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="text-decoration-none">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/auth/signup" className="text-decoration-none">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-md-3">
            <h5>Contact</h5>
            <ul className="list-unstyled">
              <li>Email: baturalpsonmez@gmail.com</li>
              <li>Phone: +90 500 000 00 00</li>
            </ul>
          </div>
        </div>
        <hr className="mt-4" />
        <div className="d-flex justify-content-between align-items-center">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} Cryptocurrency Tracking App. All
            rights reserved.
          </p>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
