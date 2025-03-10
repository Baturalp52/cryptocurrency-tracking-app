"use client";

import { CryptocurrencyDetail } from "@/services/cryptocurrency/interface";
import PriceChart from "./price-chart";
import CryptoStats from "./crypto-stats";
import CryptoLinks from "./crypto-links";
import CryptoDescription from "./crypto-description";
import Image from "next/image";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import AddToWatchList from "./add-to-watch-list";
import BlacklistCrypto from "./blacklist-crypto";
import UserRole from "@/enums/user-role";

interface CryptoDetailViewProps {
  cryptoData: CryptocurrencyDetail;
}

export default function CryptoDetailView({
  cryptoData,
}: CryptoDetailViewProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === UserRole.ADMIN;

  return (
    <div>
      {/* Header with name, symbol, and price */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 flex-wrap">
            {cryptoData.logo && (
              <Image
                src={cryptoData.logo}
                alt={cryptoData.name}
                width="32"
                height="32"
                className="me-2"
              />
            )}
            <h1 className="h3 mb-0">{cryptoData.name}</h1>
            <span className="badge bg-secondary">{cryptoData.symbol}</span>
            {cryptoData.is_active === 1 ? (
              <span className="badge bg-success">Active</span>
            ) : (
              <span className="badge bg-danger">Inactive</span>
            )}
          </div>
          <div className="text-muted small mt-1">
            Rank #{cryptoData.cmc_rank} •{" "}
            <Link
              href={`/cryptocurrencies/${cryptoData.id}`}
              className="text-decoration-none"
            >
              CoinMarketCap
            </Link>
          </div>
        </div>
        <div className="d-flex flex-column flex-md-row gap-2">
          {!!user && <AddToWatchList cryptoData={cryptoData} />}
          {isAdmin && <BlacklistCrypto cryptoData={cryptoData} />}
        </div>
      </div>

      {/* Price and chart */}
      <div className="card mb-4">
        <div className="card-body">
          <PriceChart cryptoId={cryptoData.id} />
        </div>
      </div>

      {/* Stats, Links, and Description */}
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header">
              <h3 className="h5 mb-0">Market Stats</h3>
            </div>
            <div className="card-body">
              <CryptoStats cryptoData={cryptoData} />
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header">
              <h3 className="h5 mb-0">Info & Links</h3>
            </div>
            <div className="card-body">
              <CryptoLinks cryptoData={cryptoData} />
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="card mb-4">
        <div className="card-header">
          <h3 className="h5 mb-0">About {cryptoData.name}</h3>
        </div>
        <div className="card-body">
          <CryptoDescription cryptoData={cryptoData} />
        </div>
      </div>
    </div>
  );
}
