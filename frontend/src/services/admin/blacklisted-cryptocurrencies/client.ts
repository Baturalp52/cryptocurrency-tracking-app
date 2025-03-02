import api from "../../api";
import {
  BlacklistedCryptocurrenciesResponse,
  BlacklistedCryptocurrencyResponse,
  BlacklistCryptocurrencyRequest,
  MessageResponse,
} from "./types";

/**
 * Get all blacklisted cryptocurrencies
 */
export const getBlacklistedCryptocurrencies =
  async (): Promise<BlacklistedCryptocurrenciesResponse> => {
    const response = await api.get<BlacklistedCryptocurrenciesResponse>(
      "/admin/blacklisted-cryptocurrencies"
    );
    return response.data;
  };

/**
 * Add cryptocurrency to blacklist
 */
export const blacklistCryptocurrency = async (
  data: BlacklistCryptocurrencyRequest
): Promise<BlacklistedCryptocurrencyResponse> => {
  const response = await api.post<BlacklistedCryptocurrencyResponse>(
    "/admin/blacklisted-cryptocurrencies",
    data
  );
  return response.data;
};

/**
 * Remove cryptocurrency from blacklist
 */
export const removeFromBlacklist = async (
  id: number
): Promise<MessageResponse> => {
  const response = await api.delete<MessageResponse>(
    `/admin/blacklisted-cryptocurrencies/${id}`
  );
  return response.data;
};
