"use client";

import type { CryptocurrencyData } from "@/services/cryptocurrency/interface";
import { TrendingUp } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import TableRow from "./table-row";

type TopCryptoCardProps = {
  topCryptos: CryptocurrencyData[];
};

export default function TopCryptoCard({ topCryptos }: TopCryptoCardProps) {
  const { user } = useAuth();

  return (
    <div className="card h-100 shadow-sm">
      <div className="card-header bg-primary bg-opacity-10 d-flex align-items-center">
        <TrendingUp className="text-primary me-2" size={20} />
        <h5 className="card-title mb-0">Top Cryptocurrencies</h5>
      </div>
      <div className="card-body p-0">
        {topCryptos.length === 0 ? (
          <div className="alert alert-info m-3" role="alert">
            No cryptocurrency data available at the moment.
          </div>
        ) : (
          <>
            <div className="table-responsive position-relative">
              <div className="table-container">
                <div className="table-scroll">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th scope="col" className="sticky-column">
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
              </div>
            </div>
          </>
        )}
      </div>
      {topCryptos.length > 0 && (
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
