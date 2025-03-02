import { getBlacklistedCryptocurrencies } from "@/services/admin/blacklisted-cryptocurrencies";
import BlacklistedCryptocurrenciesManagement from "./client";

export default async function BlacklistedCryptocurrenciesPage() {
  // Fetch blacklisted cryptocurrencies on the server
  const response = await getBlacklistedCryptocurrencies();

  return (
    <div className="container">
      <h1 className="mb-4">Blacklisted Cryptocurrencies</h1>
      <BlacklistedCryptocurrenciesManagement
        initialBlacklistedCryptos={response.blacklisted_cryptocurrencies}
      />
    </div>
  );
}
