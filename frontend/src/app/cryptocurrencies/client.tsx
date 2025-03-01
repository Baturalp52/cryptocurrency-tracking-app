"use client";

import {
  CryptoSearch,
  CryptoTable,
  CryptoPagination,
  CryptoEmptyState,
  CryptoLoading,
  useCryptoData,
} from "@/components/cryptocurrencies";
import { CryptocurrencySearchData } from "@/services/cryptocurrency/interface";

interface CryptocurrenciesClientProps {
  initialCryptocurrencies: CryptocurrencySearchData[];
}

export default function CryptocurrenciesClient({
  initialCryptocurrencies,
}: CryptocurrenciesClientProps) {
  const {
    searchQuery,
    setSearchQuery,
    debouncedSearchQuery,
    isLoading,
    cryptocurrencies,
    currentPage,
    setCurrentPage,
    sortField,
    sortDirection,
    handleSearch,
    handleSort,
    totalPages,
  } = useCryptoData(initialCryptocurrencies);

  return (
    <div className="container py-4">
      <h1 className="mb-4">
        {debouncedSearchQuery ? "Search Results" : "Trending Cryptocurrencies"}
      </h1>

      <CryptoSearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
      />

      {isLoading ? (
        <CryptoLoading />
      ) : cryptocurrencies.length > 0 ? (
        <>
          <CryptoTable
            cryptocurrencies={cryptocurrencies}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            searchQuery={debouncedSearchQuery}
          />

          <CryptoPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      ) : (
        <CryptoEmptyState searchQuery={debouncedSearchQuery} />
      )}
    </div>
  );
}
