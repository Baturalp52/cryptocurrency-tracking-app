export interface WatchlistCryptocurrency {
  id: number;
  watchlist_id: number;
  symbol: string;
  name: string;
  cmc_id?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Watchlist {
  id: number;
  user_id: number;
  name: string;
  description?: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
  cryptocurrencies: WatchlistCryptocurrency[];
}

export interface CreateWatchlistRequest {
  name: string;
  description?: string;
}

export interface UpdateWatchlistRequest {
  name: string;
  description?: string;
}

export interface AddCryptocurrencyRequest {
  symbol: string;
  name: string;
  cmc_id?: number;
  notes?: string;
}

export interface UpdateCryptocurrencyNotesRequest {
  notes?: string;
  cmc_id?: number;
}
