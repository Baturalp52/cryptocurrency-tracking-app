import React from "react";
import CryptocurrenciesClient from "./client";
import { CryptocurrencySearchData } from "@/services/cryptocurrency/interface";
import { getTrendingCryptocurrencies } from "@/services/cryptocurrency";

export const dynamic = "force-dynamic";
export const revalidate = 60; // Revalidate every 60 seconds

export default async function CryptocurrenciesPage() {
  // Fetch trending cryptocurrencies on the server side
  const initialCryptocurrencies: CryptocurrencySearchData[] =
    await getTrendingCryptocurrencies();

  return (
    <CryptocurrenciesClient initialCryptocurrencies={initialCryptocurrencies} />
  );
}
