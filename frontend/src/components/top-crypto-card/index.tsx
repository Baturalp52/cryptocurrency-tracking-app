"use client";

import { useEffect, useState } from "react";
import type { CryptocurrencyData } from "@/services/cryptocurrency/interface";
import { getTopCryptocurrencies } from "@/services/cryptocurrency";
import { TrendingUp, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import TableRow from "./table-row";

export default function TopCryptoCard() {
  const [topCryptos, setTopCryptos] = useState<CryptocurrencyData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTopCryptos = async () => {
      try {
        setLoading(true);
        const response = await getTopCryptocurrencies(5); // Get top 5 cryptocurrencies
        setTopCryptos(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch top cryptocurrencies");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopCryptos();

    // Refresh data every 60 seconds
    const intervalId = setInterval(fetchTopCryptos, 60000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="card h-100 shadow-sm">
      <div className="card-header bg-primary bg-opacity-10 d-flex align-items-center">
        <TrendingUp className="text-primary me-2" size={20} />
        <h5 className="card-title mb-0">Top Cryptocurrencies</h5>
      </div>
      <div className="card-body p-0">
        {loading ? (
          <div className="d-flex justify-content-center align-items-center p-5">
            <Loader2 className="animate-spin text-primary me-2" size={24} />
            <span>Loading cryptocurrency data...</span>
          </div>
        ) : error ? (
          <div className="alert alert-danger m-3" role="alert">
            {error}
          </div>
        ) : topCryptos.length === 0 ? (
          <div className="alert alert-info m-3" role="alert">
            No cryptocurrency data available at the moment.
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th scope="col" className="">
                      Name
                    </th>
                    <th scope="col" className="text-end">
                      Price
                    </th>
                    <th scope="col" className="text-end">
                      24h %
                    </th>
                    <th scope="col" className="text-end text-nowrap">
                      Market Cap
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topCryptos.map((crypto) => (
                    <TableRow key={crypto.id} crypto={crypto} />
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
      {!loading && !error && topCryptos.length > 0 && (
        <div className="card-footer text-center">
          {user ? (
            <Link
              href="/cryptocurrency"
              className="btn btn-sm btn-outline-primary"
            >
              View All Cryptocurrencies
            </Link>
          ) : (
            <Link href="/auth/login" className="btn btn-sm btn-outline-primary">
              Login to View More
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
