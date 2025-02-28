"use client";

import React from "react";
import { CryptocurrencyDetail } from "@/services/cryptocurrency/interface";
import { formatCurrency, formatNumber, formatPercentage } from "./utils";

interface CryptoStatsProps {
  cryptoData: CryptocurrencyDetail;
}

export default function CryptoStats({ cryptoData }: CryptoStatsProps) {
  const usdQuote = cryptoData.quote.USD;

  return (
    <div className="crypto-stats">
      <div className="table-responsive">
        <table className="table table-borderless table-sm table-no-bg">
          <tbody>
            {/* Price */}
            <tr>
              <td className="text-muted">Price</td>
              <td className="text-end">{formatCurrency(usdQuote.price)}</td>
            </tr>

            {/* 24h % Change */}
            <tr>
              <td className="text-muted text-nowrap">24h % Change</td>
              <td className="text-end">
                {formatPercentage(usdQuote.percent_change_24h)}
              </td>
            </tr>

            {/* 7d % Change */}
            <tr>
              <td className="text-muted text-nowrap">7d % Change</td>
              <td className="text-end">
                {formatPercentage(usdQuote.percent_change_7d)}
              </td>
            </tr>

            {/* 30d % Change */}
            <tr>
              <td className="text-muted text-nowrap">30d % Change</td>
              <td className="text-end">
                {formatPercentage(usdQuote.percent_change_30d)}
              </td>
            </tr>

            {/* Market Cap */}
            <tr>
              <td className="text-muted text-nowrap">Market Cap</td>
              <td className="text-end">
                {formatCurrency(usdQuote.market_cap)}
              </td>
            </tr>

            {/* Market Cap Dominance */}
            {usdQuote.market_cap_dominance !== undefined && (
              <tr>
                <td className="text-muted text-nowrap">Market Cap Dominance</td>
                <td className="text-end">
                  {new Intl.NumberFormat("en-US", {
                    style: "percent",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(usdQuote.market_cap_dominance / 100)}
                </td>
              </tr>
            )}

            {/* Volume 24h */}
            <tr>
              <td className="text-muted text-nowrap">Volume 24h</td>
              <td className="text-end">
                {formatCurrency(usdQuote.volume_24h)}
              </td>
            </tr>

            {/* Volume Change 24h */}
            {usdQuote.volume_change_24h !== undefined && (
              <tr>
                <td className="text-muted text-nowrap">Volume Change 24h</td>
                <td className="text-end">
                  {formatPercentage(usdQuote.volume_change_24h)}
                </td>
              </tr>
            )}

            {/* Circulating Supply */}
            <tr>
              <td className="text-muted text-nowrap">Circulating Supply</td>
              <td className="text-end">
                {formatNumber(cryptoData.circulating_supply)}{" "}
                {cryptoData.symbol}
              </td>
            </tr>

            {/* Total Supply */}
            {cryptoData.total_supply !== null && (
              <tr>
                <td className="text-muted text-nowrap">Total Supply</td>
                <td className="text-end">
                  {formatNumber(cryptoData.total_supply)} {cryptoData.symbol}
                </td>
              </tr>
            )}

            {/* Max Supply */}
            {cryptoData.max_supply !== null && (
              <tr>
                <td className="text-muted text-nowrap">Max Supply</td>
                <td className="text-end">
                  {formatNumber(cryptoData.max_supply)} {cryptoData.symbol}
                </td>
              </tr>
            )}

            {/* Fully Diluted Market Cap */}
            {usdQuote.fully_diluted_market_cap !== undefined && (
              <tr>
                <td className="text-muted text-nowrap">
                  Fully Diluted Market Cap
                </td>
                <td className="text-end">
                  {formatCurrency(usdQuote.fully_diluted_market_cap)}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
