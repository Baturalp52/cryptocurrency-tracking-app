import api from "../../api";
import {
  AddCryptocurrencyToWatchlistRequest,
  UpdateCryptocurrencyNotesRequest,
  WatchlistCryptocurrency,
} from "./interface";

/**
 * Add a cryptocurrency to a watchlist
 * @param watchlistId Watchlist ID
 * @param data Cryptocurrency data
 * @returns Promise with added cryptocurrency data
 */
export const addCryptocurrency = async (
  watchlistId: number,
  data: AddCryptocurrencyToWatchlistRequest
): Promise<WatchlistCryptocurrency> => {
  try {
    const response = await api.post<WatchlistCryptocurrency>(
      `/watchlists/${watchlistId}/cryptocurrencies`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error adding cryptocurrency to watchlist:", error);
    throw error;
  }
};

/**
 * Remove a cryptocurrency from a watchlist
 * @param watchlistId Watchlist ID
 * @param symbol Cryptocurrency symbol
 * @returns Promise with success message
 */
export const removeCryptocurrency = async (
  watchlistId: number,
  symbol: string
): Promise<{ message: string }> => {
  try {
    const response = await api.delete<{ message: string }>(
      `/watchlists/${watchlistId}/cryptocurrencies/${symbol}`
    );
    return response.data;
  } catch (error) {
    console.error("Error removing cryptocurrency from watchlist:", error);
    throw error;
  }
};

/**
 * Update notes for a cryptocurrency in a watchlist
 * @param watchlistId Watchlist ID
 * @param symbol Cryptocurrency symbol
 * @param data Updated notes data
 * @returns Promise with updated cryptocurrency data
 */
export const updateCryptocurrencyNotes = async (
  watchlistId: number,
  symbol: string,
  data: UpdateCryptocurrencyNotesRequest
): Promise<WatchlistCryptocurrency> => {
  try {
    const response = await api.put<WatchlistCryptocurrency>(
      `/watchlists/${watchlistId}/cryptocurrencies/${symbol}/notes`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error updating cryptocurrency notes:", error);
    throw error;
  }
};
