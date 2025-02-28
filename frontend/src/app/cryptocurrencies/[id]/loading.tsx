export default function CryptocurrencyLoading() {
  return (
    <div className="container">
      {/* Header Section Skeleton */}
      <div className="card mb-4 border-0 shadow-sm">
        <div className="card-body">
          <div className="d-flex align-items-center mb-3">
            <div className="me-3 placeholder-glow">
              <div
                className="rounded-circle placeholder"
                style={{ width: "48px", height: "48px" }}
              ></div>
            </div>
            <div className="w-100">
              <div className="h3  placeholder-glow">
                <span className="placeholder col-6 rounded"></span>
              </div>
              <div className="text-muted small placeholder-glow">
                <span className="placeholder col-4 rounded"></span>
              </div>
            </div>
          </div>

          {/* Price Information Skeleton */}
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <div className="d-flex flex-column">
                <div className="h3 placeholder-glow">
                  <span className="placeholder col-8 rounded"></span>
                </div>
                <div className="text-muted small placeholder-glow">
                  <span className="placeholder col-4 rounded"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Price Chart Skeleton */}
      <div className="card mb-4 border-0 shadow-sm">
        <div className="card-body">
          <h2 className="h5 mb-3 placeholder-glow">
            <span className="placeholder col-4 rounded"></span>
          </h2>
          <div className="placeholder-glow">
            <div
              className="placeholder rounded w-100"
              style={{ height: "300px" }}
            ></div>
          </div>
        </div>
      </div>

      {/* Stats and Info Skeleton */}
      <div className="row g-4">
        {/* Market Stats Skeleton */}
        <div className="col-12 col-lg-6">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <h2 className="h5 mb-3 placeholder-glow">
                <span className="placeholder col-4 rounded"></span>
              </h2>
              <div className="placeholder-glow">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="d-flex justify-content-between mb-2">
                    <span className="placeholder col-4 rounded"></span>
                    <span className="placeholder col-3 rounded"></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Info and Links Skeleton */}
        <div className="col-12 col-lg-6">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <h2 className="h5 mb-3 placeholder-glow">
                <span className="placeholder col-4 rounded"></span>
              </h2>
              <div className="placeholder-glow">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="d-flex justify-content-between mb-2">
                    <span className="placeholder col-4 rounded"></span>
                    <span className="placeholder col-3 rounded"></span>
                  </div>
                ))}
              </div>
              <div className="d-grid gap-2 mt-4 placeholder-glow">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="placeholder col-12 rounded"
                    style={{ height: "38px" }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description Skeleton */}
      <div className="card mt-4 border-0 shadow-sm">
        <div className="card-body">
          <h2 className="h5 mb-3 placeholder-glow">
            <span className="placeholder col-4 rounded"></span>
          </h2>
          <div className="placeholder-glow">
            <span className="placeholder col-12 rounded"></span>
            <span className="placeholder col-12 rounded"></span>
            <span className="placeholder col-12 rounded"></span>
            <span className="placeholder col-8 rounded"></span>
          </div>
        </div>
      </div>
    </div>
  );
}
