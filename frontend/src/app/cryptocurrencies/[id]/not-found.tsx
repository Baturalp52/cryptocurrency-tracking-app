import Link from "next/link";

export default function CryptocurrencyNotFound() {
  return (
    <div className="container py-5 text-center">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-5">
              <h1 className="h3 mb-4">Cryptocurrency Not Found</h1>
              <p className="text-muted mb-4">
                The cryptocurrency you are looking for does not exist or could
                not be found.
              </p>
              <Link href="/" className="btn btn-primary">
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
