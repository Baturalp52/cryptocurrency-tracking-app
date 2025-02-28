import Link from "next/link";
import ThemeToggle from "@/components/theme-toggle";
import { AtSign, Phone } from "lucide-react";

// Define footer links as constants
const FOOTER_LINKS = [
  { href: "/", label: "Home" },
  { href: "/auth/login", label: "Login" },
  { href: "/auth/signup", label: "Sign Up" },
];

// Define contact information as constants
const CONTACT_INFO = [
  {
    icon: AtSign,
    text: "baturalpsonmez@gmail.com",
  },
  {
    icon: Phone,
    text: "+90 500 000 00 00",
  },
];

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
              {FOOTER_LINKS.map((link) => (
                <li className="mb-2" key={link.href}>
                  <Link
                    href={link.href}
                    className="text-decoration-none d-inline-block py-1"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-12 col-md-6 col-lg-4">
            <h5 className="mb-3">Contact</h5>
            <ul className="list-unstyled">
              {CONTACT_INFO.map((item, index) => {
                const Icon = item.icon;
                return (
                  <li className="mb-2 d-flex align-items-center" key={index}>
                    <Icon className="me-2 w-2 h-2" />
                    <span>{item.text}</span>
                  </li>
                );
              })}
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
