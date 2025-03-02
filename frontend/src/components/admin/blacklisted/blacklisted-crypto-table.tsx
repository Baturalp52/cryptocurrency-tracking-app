"use client";

import { BlacklistedCryptocurrency } from "@/services/admin/blacklisted-cryptocurrencies/types";
import BlacklistedCryptoRow from "./blacklisted-crypto-row";

interface BlacklistedCryptoTableProps {
  blacklistedCryptos: BlacklistedCryptocurrency[];
  isLoading: boolean;
  onRemove: (id: number) => Promise<void>;
}

export default function BlacklistedCryptoTable({
  blacklistedCryptos,
  isLoading,
  onRemove,
}: BlacklistedCryptoTableProps) {
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (blacklistedCryptos.length === 0) {
    return (
      <p className="text-center mt-4">No blacklisted cryptocurrencies found.</p>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead>
          <tr>
            <th scope="col" className="sticky-column">
              Symbol
            </th>
            <th scope="col" className="text-nowrap">
              Name
            </th>
            <th scope="col" className="text-nowrap">
              Reason
            </th>
            <th scope="col" className="text-nowrap">
              Blacklisted By
            </th>
            <th scope="col" className="text-nowrap">
              Date
            </th>
            <th scope="col" className="text-nowrap">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {blacklistedCryptos.map((crypto) => (
            <BlacklistedCryptoRow
              key={crypto.id}
              crypto={crypto}
              onRemove={onRemove}
              isLoading={isLoading}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
