import { WatchlistCryptocurrency } from "../interface";

export interface AddCryptocurrencyToWatchlistRequest {
  symbol: string;
  name: string;
  cmc_id?: number;
  notes?: string;
}

export interface UpdateCryptocurrencyNotesRequest {
  notes?: string;
  cmc_id?: number;
}

export type { WatchlistCryptocurrency };
