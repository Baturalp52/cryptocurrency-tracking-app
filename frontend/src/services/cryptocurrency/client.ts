import api from "../api";
import {
  TopCryptocurrenciesResponse,
  CryptocurrencyDetailResponse,
  CryptocurrencySearchData,
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
 * Fetch trending cryptocurrencies
 * @param limit Number of results to return (default: 20)
 * @param by Field to sort by (default: marketCap)
 * @param order Sort direction (default: desc)
 * @returns Promise with trending cryptocurrency data
 */
export const getTrendingCryptocurrencies = async (
  limit: number = 20,
  by: string = "marketCap",
  order: string = "desc"
): Promise<CryptocurrencySearchData[]> => {
  try {
    const response = await api.get<{
      data: CryptocurrencySearchData[];
      total: number;
    }>(`/cryptocurrencies/trending?limit=${limit}&by=${by}&order=${order}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching trending cryptocurrencies:", error);
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

/**
 * Search for cryptocurrencies by name or symbol
 * @param query Search query
 * @param limit Number of results to return (default: 20)
 * @param convert Currency to convert to (default: USD)
 * @param by Field to sort by (default: marketCap)
 * @param order Sort direction (default: desc)
 * @returns Promise with search results
 */
export const searchCryptocurrencies = async (
  query: string,
  limit: number = 20,
  convert: string = "USD",
  by: string = "marketCap",
  order: string = "desc"
): Promise<CryptocurrencySearchData[]> => {
  try {
    const response = await api.get<{
      data: CryptocurrencySearchData[];
      total: number;
    }>(
      `/cryptocurrencies/search?query=${query}&limit=${limit}&convert=${convert}&by=${by}&order=${order}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error searching cryptocurrencies:", error);
    throw error;
  }
};
