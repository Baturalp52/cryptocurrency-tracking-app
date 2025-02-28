import api from "../api";
import {
  TopCryptocurrenciesResponse,
  CryptocurrencyDetailResponse,
} from "./interface";

/**
 * Fetch top cryptocurrencies
 * @param limit Number of results to return (default: 10)
 * @returns Promise with top cryptocurrency data
 */
export const getTopCryptocurrencies = async (
  limit: number = 10
): Promise<TopCryptocurrenciesResponse> => {
  try {
    const response = await api.get<TopCryptocurrenciesResponse>(
      `/cryptocurrencies/top?limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching top cryptocurrencies:", error);
    throw error;
  }
};

/**
 * Fetch detailed information for a specific cryptocurrency
 * @param id CoinMarketCap ID of the cryptocurrency
 * @returns Promise with detailed cryptocurrency data
 */
export const getCryptocurrencyDetail = async (
  id: number
): Promise<CryptocurrencyDetailResponse> => {
  try {
    const response = await api.get<CryptocurrencyDetailResponse>(
      `/cryptocurrencies/${id}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching cryptocurrency details for ID ${id}:`, error);
    throw error;
  }
};

export * from "./interface";
