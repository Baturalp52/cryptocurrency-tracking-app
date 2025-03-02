"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function ErrorPage() {
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm border-0 mt-5">
            <div className="card-body p-4 text-center">
              <div className="mb-4 text-danger">
                <AlertTriangle size={64} />
              </div>
              <h1 className="h3 mb-3">Something went wrong</h1>
              <p className="text-muted mb-4">
                We encountered an error while processing your request. This
                could be due to a temporary server issue or network problem.
              </p>
              <div className="d-flex flex-column flex-md-row justify-content-center gap-2">
                <button
                  className="btn btn-primary"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </button>
                <Link href="/" className="btn btn-outline-secondary">
                  Return to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
