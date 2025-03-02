export interface BlacklistedCryptocurrency {
  id: number;
  symbol: string;
  name: string | null;
  cmc_id: number;
  reason: string | null;
  blacklisted_by: number | null;
  blacklisted_by_user?: {
    id: number;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

export interface BlacklistedCryptocurrenciesResponse {
  blacklisted_cryptocurrencies: BlacklistedCryptocurrency[];
}

export interface BlacklistedCryptocurrencyResponse {
  blacklisted_cryptocurrency: BlacklistedCryptocurrency;
  message: string;
}

export interface MessageResponse {
  message: string;
}

export interface BlacklistCryptocurrencyRequest {
  symbol: string;
  name?: string;
  cmc_id: string;
  reason?: string;
}
