import api from "../api";
import {
  Watchlist,
  CreateWatchlistRequest,
  UpdateWatchlistRequest,
} from "./interface";

/**
 * Get all watchlists for the authenticated user
 * @returns Promise with all user watchlists
 */
export const getWatchlists = async (): Promise<Watchlist[]> => {
  try {
    const response = await api.get<Watchlist[]>("/watchlists");
    return response.data;
  } catch (error) {
    console.error("Error fetching watchlists:", error);
    throw error;
  }
};

/**
 * Get a specific watchlist by ID
 * @param id Watchlist ID
 * @returns Promise with watchlist data
 */
export const getWatchlist = async (id: number): Promise<Watchlist> => {
  try {
    const response = await api.get<Watchlist>(`/watchlists/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching watchlist ${id}:`, error);
    throw error;
  }
};

/**
 * Get the user's favorites watchlist
 * @returns Promise with favorites watchlist data
 */
export const getFavorites = async (): Promise<Watchlist> => {
  try {
    const response = await api.get<Watchlist>("/watchlists/favorites");
    return response.data;
  } catch (error) {
    console.error("Error fetching favorites:", error);
    throw error;
  }
};

/**
 * Create a new watchlist
 * @param data Watchlist data
 * @returns Promise with created watchlist
 */
export const createWatchlist = async (
  data: CreateWatchlistRequest
): Promise<Watchlist> => {
  try {
    const response = await api.post<Watchlist>("/watchlists", data);
    return response.data;
  } catch (error) {
    console.error("Error creating watchlist:", error);
    throw error;
  }
};

/**
 * Update a watchlist
 * @param id Watchlist ID
 * @param data Updated watchlist data
 * @returns Promise with updated watchlist
 */
export const updateWatchlist = async (
  id: number,
  data: UpdateWatchlistRequest
): Promise<Watchlist> => {
  try {
    const response = await api.put<Watchlist>(`/watchlists/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating watchlist ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a watchlist
 * @param id Watchlist ID
 * @returns Promise with success message
 */
export const deleteWatchlist = async (
  id: number
): Promise<{ message: string }> => {
  try {
    const response = await api.delete<{ message: string }>(`/watchlists/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting watchlist ${id}:`, error);
    throw error;
  }
};

export * from "./interface";
