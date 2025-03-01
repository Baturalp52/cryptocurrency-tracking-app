import React from "react";
import { CryptoEmptyStateProps } from "./types";

function CryptoEmptyState({ searchQuery }: CryptoEmptyStateProps) {
  return (
    <div className="card">
      <div className="card-body text-center py-5">
        <p className="mb-0">
          {searchQuery
            ? `No cryptocurrencies found matching "${searchQuery}"`
            : "No trending cryptocurrencies available."}
        </p>
      </div>
    </div>
  );
}

export default CryptoEmptyState;
