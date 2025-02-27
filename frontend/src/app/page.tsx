"use client";

import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-10 text-center">
          <h1 className="display-4 fw-bold mb-4">
            Cryptocurrency Tracking App
          </h1>

          {user ? (
            <div className="alert alert-success mb-4" role="alert">
              Welcome back, {user.name}! You are logged in.
            </div>
          ) : (
            <div className="mb-4">
              <p className="lead">
                Track your favorite cryptocurrencies in real-time.
              </p>
              <div className="mt-4">
                <Link href="/auth/login" className="btn btn-primary me-2">
                  Login
                </Link>
                <Link href="/auth/signup" className="btn btn-outline-primary">
                  Sign Up
                </Link>
              </div>
            </div>
          )}

          <div className="row mt-5">
            <div className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h3 className="card-title">Real-time Data</h3>
                  <p className="card-text">
                    Get the latest cryptocurrency prices and market data updated
                    in real-time.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h3 className="card-title">Portfolio Tracking</h3>
                  <p className="card-text">
                    Create your own portfolio and track your cryptocurrency
                    investments.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h3 className="card-title">Price Alerts</h3>
                  <p className="card-text">
                    Set up price alerts to be notified when cryptocurrencies
                    reach your target price.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
