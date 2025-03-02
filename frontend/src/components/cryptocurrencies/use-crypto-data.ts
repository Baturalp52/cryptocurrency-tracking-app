import { useState, useCallback, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import {
  CryptocurrencySearchData,
  searchCryptocurrencies,
  getTrendingCryptocurrencies,
} from "@/services/cryptocurrency";
import { SortField, SortDirection } from "./types";

function useCryptoData(
  initialCryptocurrencies: CryptocurrencySearchData[] = [],
  pageSize: number = 20
) {
  const searchParams = useSearchParams();
  const initialSearchQuery = searchParams.get("search") || "";

  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [isLoading, setIsLoading] = useState(
    initialCryptocurrencies.length === 0
  );
  const [cryptocurrencies, setCryptocurrencies] = useState<
    CryptocurrencySearchData[]
  >(initialCryptocurrencies);
  const [totalCryptos, setTotalCryptos] = useState(
    initialCryptocurrencies.length
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("marketCap");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const isInitialRender = useRef(true);

  const loadCryptocurrencies = useCallback(async () => {
    setIsLoading(true);
    try {
      let cryptoData: CryptocurrencySearchData[] = [];

      if (debouncedSearchQuery.trim()) {
        // Update URL with search query and sort parameters
        window.history.pushState(
          {},
          "",
          `/cryptocurrencies?search=${encodeURIComponent(
            debouncedSearchQuery
          )}&by=${sortField}&order=${sortDirection}`
        );
        // If there's a search query, fetch search results with sort parameters
        cryptoData = await searchCryptocurrencies(
          debouncedSearchQuery,
          pageSize,
          "USD",
          sortField,
          sortDirection
        );
      } else {
        // Update URL with sort parameters
        window.history.pushState(
          {},
          "",
          `/cryptocurrencies?by=${sortField}&order=${sortDirection}`
        );
        // If no search query, fetch trending cryptocurrencies with sort parameters
        cryptoData = await getTrendingCryptocurrencies(
          pageSize,
          sortField,
          sortDirection
        );
      }

      setCryptocurrencies(cryptoData);
      setTotalCryptos(cryptoData.length);
    } catch (error) {
      console.error("Error loading cryptocurrencies:", error);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchQuery, sortField, sortDirection, pageSize]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Reset to first page when searching
    setCurrentPage(1);
  };

  const handleSort = (field: SortField) => {
    let newDirection: SortDirection;

    if (field === sortField) {
      // Toggle direction if clicking the same field
      newDirection = sortDirection === "asc" ? "desc" : "asc";
      setSortDirection(newDirection);
    } else {
      // Set new field and default to descending for marketCap and price, ascending for others
      setSortField(field);
      if (field === "marketCap" || field === "price") {
        setSortDirection("desc");
      } else {
        setSortDirection("asc");
      }
    }
  };

  // Load cryptocurrencies when search/sort/pagination changes
  useEffect(() => {
    // Skip initial load if we have initial data
    if (initialCryptocurrencies.length === 0) {
      loadCryptocurrencies();
    }
  }, [initialCryptocurrencies.length, loadCryptocurrencies]);

  // This effect will handle changes to sort, search, or pagination
  useEffect(() => {
    // Don't run on initial render
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    // Only run when dependencies change (not on initial render)
    loadCryptocurrencies();
  }, [
    debouncedSearchQuery,
    sortField,
    sortDirection,
    currentPage,
    loadCryptocurrencies,
  ]);

  const totalPages = Math.ceil(totalCryptos / pageSize);

  return {
    searchQuery,
    setSearchQuery,
    debouncedSearchQuery,
    isLoading,
    setIsLoading,
    cryptocurrencies,
    setCryptocurrencies,
    totalCryptos,
    setTotalCryptos,
    currentPage,
    setCurrentPage,
    sortField,
    sortDirection,
    handleSearch,
    handleSort,
    totalPages,
  };
}

export default useCryptoData;
