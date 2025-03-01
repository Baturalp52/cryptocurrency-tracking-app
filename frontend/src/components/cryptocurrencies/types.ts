import { CryptocurrencySearchData } from "@/services/cryptocurrency";
import { ReactNode } from "react";

type SortField = "name" | "price" | "change24h" | "marketCap";
type SortDirection = "asc" | "desc";

interface SortProps {
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  renderSortIcon: (field: SortField) => ReactNode;
}

interface CryptoTableProps {
  cryptocurrencies: CryptocurrencySearchData[];
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  searchQuery: string;
}

interface CryptoSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: (e: React.FormEvent) => void;
}

interface CryptoPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

interface CryptoEmptyStateProps {
  searchQuery: string;
}

type CryptoLoadingProps = Record<string, never>;

export type {
  SortField,
  SortDirection,
  SortProps,
  CryptoTableProps,
  CryptoSearchProps,
  CryptoPaginationProps,
  CryptoEmptyStateProps,
  CryptoLoadingProps,
};
