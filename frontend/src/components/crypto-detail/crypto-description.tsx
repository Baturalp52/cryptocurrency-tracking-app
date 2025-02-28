"use client";

import React, { useState } from "react";
import { CryptocurrencyDetail } from "@/services/cryptocurrency/interface";

interface CryptoDescriptionProps {
  cryptoData: CryptocurrencyDetail;
}

export default function CryptoDescription({
  cryptoData,
}: CryptoDescriptionProps) {
  const [expanded, setExpanded] = useState(false);

  // If no description is available
  if (!cryptoData.description) {
    return (
      <div className="crypto-description p-3 bg-light rounded">
        <p className="text-muted mb-0">
          No description available for {cryptoData.name}.
        </p>
      </div>
    );
  }

  // Clean HTML content if needed (remove unwanted tags, etc.)
  const cleanDescription = cryptoData.description;

  // Determine if the description is long enough to need truncation
  const isLongDescription = cleanDescription.length > 300;

  // Get the truncated description for collapsed state
  const truncatedDescription = isLongDescription
    ? cleanDescription.substring(0, 300) + "..."
    : cleanDescription;

  return (
    <div className="crypto-description">
      <div className="p-3 rounded">
        <h6 className="mb-3">About {cryptoData.name}</h6>

        <div
          className={`description-content ${expanded ? "expanded" : ""}`}
          dangerouslySetInnerHTML={{
            __html: expanded ? cleanDescription : truncatedDescription,
          }}
        />

        {isLongDescription && (
          <button
            className="btn btn-link p-0 mt-2 text-decoration-none"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Show Less" : "Read More"}
          </button>
        )}
      </div>
    </div>
  );
}
