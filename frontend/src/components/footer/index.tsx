import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
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
                <Link href="/" className="text-decoration-none text-light">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/login"
                  className="text-decoration-none text-light"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/signup"
                  className="text-decoration-none text-light"
                >
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-md-3">
            <h5>Contact</h5>
            <ul className="list-unstyled">
              <li className="text-light">Email: info@cryptotracker.com</li>
              <li className="text-light">Phone: +1 (123) 456-7890</li>
            </ul>
          </div>
        </div>
        <hr className="mt-4" />
        <div className="text-center">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} Cryptocurrency Tracking App. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
