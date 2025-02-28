"use server";

import { ChartLine, Wallet } from "lucide-react";
import TopCryptoCard from "@/components/top-crypto-card";
import { getTopCryptocurrencies } from "@/services/cryptocurrency";

export default async function Home() {
  const topCryptos = await getTopCryptocurrencies(5);

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 text-center">
          <h1 className="display-4 fw-bold mb-3">Crypto Tracker</h1>
          <p className="lead mb-4">
            Track your favorite cryptocurrencies in real-time
          </p>

          <div className="row mt-4 gy-4">
            {/* Top Cryptocurrencies Card */}
            <div className="col-12 col-lg-6 mb-4">
              <TopCryptoCard topCryptos={topCryptos.data} />
            </div>

            <div className="col-12 col-lg-6">
              <div className="row gy-4">
                <div className="col-12 col-sm-6">
                  <div className="card h-100 shadow-sm">
                    <div className="card-body text-center text-sm-start p-4">
                      <div className="d-inline-block bg-primary bg-opacity-10 p-3 rounded-circle mb-3">
                        <ChartLine className="w-10 h-10 text-primary" />
                      </div>
                      <h3 className="card-title h4 mb-3">Real-time Data</h3>
                      <p className="card-text">
                        Get the latest cryptocurrency prices and market data.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-sm-6">
                  <div className="card h-100 shadow-sm">
                    <div className="card-body text-center text-sm-start p-4">
                      <div className="d-inline-block bg-success bg-opacity-10 p-3 rounded-circle mb-3">
                        <Wallet className="w-10 h-10 text-success" />
                      </div>
                      <h3 className="card-title h4 mb-3">Portfolio Tracking</h3>
                      <p className="card-text">
                        Create your cryptocurrency investments.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
