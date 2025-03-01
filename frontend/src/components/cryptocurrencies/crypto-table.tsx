import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowUp, ArrowDown, TrendingUp } from "lucide-react";
import { CryptoTableProps, SortField } from "./types";

function CryptoTable({
  cryptocurrencies,
  sortField,
  sortDirection,
  onSort,
  searchQuery,
}: CryptoTableProps) {
  const router = useRouter();

  const renderSortIcon = (field: SortField) => {
    if (field !== sortField) return null;

    return sortDirection === "asc" ? (
      <ArrowUp size={16} className="ms-1" />
    ) : (
      <ArrowDown size={16} className="ms-1" />
    );
  };

  return (
    <div className="card">
      <div className="card-header d-flex align-items-center">
        {!searchQuery && (
          <>
            <TrendingUp size={18} className="text-primary me-2" />
            <h5 className="mb-0">Trending Now</h5>
          </>
        )}
        {searchQuery && (
          <h5 className="mb-0">Results for &quot;{searchQuery}&quot;</h5>
        )}
      </div>
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th
                className="cursor-pointer sticky-column"
                onClick={() => onSort("name")}
              >
                <div className="d-flex align-items-center">
                  Name {renderSortIcon("name")}
                </div>
              </th>
              <th
                className="text-end cursor-pointer"
                onClick={() => onSort("price")}
              >
                <div className="d-flex align-items-center justify-content-end">
                  Price {renderSortIcon("price")}
                </div>
              </th>
              <th
                className="text-end cursor-pointer"
                onClick={() => onSort("change24h")}
              >
                <div className="d-flex align-items-center justify-content-end">
                  24h % {renderSortIcon("change24h")}
                </div>
              </th>
              <th
                className="text-end cursor-pointer d-none d-md-table-cell"
                onClick={() => onSort("marketCap")}
              >
                <div className="d-flex align-items-center justify-content-end">
                  Market Cap {renderSortIcon("marketCap")}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {cryptocurrencies.map((crypto) => (
              <tr
                key={crypto.id}
                className="cursor-pointer"
                onClick={() => router.push(`/cryptocurrencies/${crypto.id}`)}
              >
                <td className="sticky-column">
                  <div className="d-flex align-items-center">
                    <Image
                      src={
                        crypto.logo ||
                        `https://cryptologos.cc/logos/${
                          crypto.id
                        }-${crypto.symbol.toLowerCase()}-logo.png?v=023`
                      }
                      alt={crypto.name}
                      width={32}
                      height={32}
                      className="me-3"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/32";
                      }}
                    />
                    <div>
                      <div className="fw-medium">{crypto.name}</div>
                      <small className="text-muted">{crypto.symbol}</small>
                    </div>
                  </div>
                </td>
                <td className="text-end">${crypto.price.toLocaleString()}</td>
                <td
                  className={`text-end ${
                    crypto.change24h >= 0 ? "text-success" : "text-danger"
                  }`}
                >
                  {crypto.change24h >= 0 ? "+" : ""}
                  {crypto.change24h}%
                </td>
                <td className="text-end d-none d-md-table-cell">
                  {crypto.marketCap
                    ? `$${crypto.marketCap.toLocaleString()}`
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CryptoTable;
