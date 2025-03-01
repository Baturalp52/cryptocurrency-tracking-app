import React from "react";
import { Search, XCircle } from "lucide-react";
import { CryptoSearchProps } from "./types";

function CryptoSearch({ searchQuery, setSearchQuery }: CryptoSearchProps) {
  return (
    <div className="d-flex align-items-center w-100 mb-4">
      <Search size={20} className="text-muted" />
      <input
        type="text"
        className="form-control border-0 shadow-none flex-fill mx-2"
        placeholder="Search cryptocurrencies..."
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
        }}
      />
      {searchQuery && (
        <button
          type="button"
          className="btn btn-link p-0 text-muted me-2"
          onClick={() => setSearchQuery("")}
        >
          <XCircle size={20} />
        </button>
      )}
    </div>
  );
}

export default CryptoSearch;
