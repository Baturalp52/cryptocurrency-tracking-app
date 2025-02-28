import api from "../api";
import { TopCryptocurrenciesResponse } from "./interface";

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
      `/cryptocurrency/top?limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching top cryptocurrencies:", error);
    throw error;
  }
};

export * from "./interface";
