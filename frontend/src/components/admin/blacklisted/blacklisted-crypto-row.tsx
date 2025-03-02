"use client";

import { getSymbolImage } from "@/components/top-crypto-card/utils";
import { BlacklistedCryptocurrency } from "@/services/admin/blacklisted-cryptocurrencies/types";
import Image from "next/image";

interface BlacklistedCryptoRowProps {
  crypto: BlacklistedCryptocurrency;
  onRemove: (id: number) => Promise<void>;
  isLoading: boolean;
}

export default function BlacklistedCryptoRow({
  crypto,
  onRemove,
  isLoading,
}: BlacklistedCryptoRowProps) {
  return (
    <tr>
      <td className="sticky-column">
        <div className="d-flex align-items-center">
          <div className="me-2 bg-light rounded-circle text-center w-4 h-4">
            <Image
              src={getSymbolImage(crypto.cmc_id)}
              width={64}
              height={64}
              alt={crypto.name || "N/A"}
              className="w-100 h-100"
            />
          </div>
          <div className="d-flex flex-column align-items-start">
            <div className="fw-medium text-nowrap">{crypto.name}</div>
            <small className="text-muted">{crypto.symbol}</small>
          </div>
        </div>
      </td>
      <td>{crypto.name || "N/A"}</td>
      <td>{crypto.reason || "N/A"}</td>
      <td>
        {crypto.blacklisted_by_user ? crypto.blacklisted_by_user.name : "N/A"}
      </td>
      <td>{new Date(crypto.created_at).toLocaleDateString()}</td>
      <td>
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={() => onRemove(crypto.cmc_id)}
          disabled={isLoading}
        >
          Remove
        </button>
      </td>
    </tr>
  );
}
