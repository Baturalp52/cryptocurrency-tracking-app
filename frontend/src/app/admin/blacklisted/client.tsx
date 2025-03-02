"use client";

import { useState } from "react";
import { BlacklistedCryptocurrency } from "@/services/admin/blacklisted-cryptocurrencies/types";
import { removeFromBlacklist } from "@/services/admin/blacklisted-cryptocurrencies";
import BlacklistedCryptoTable from "@/components/admin/blacklisted/blacklisted-crypto-table";

interface BlacklistedCryptocurrenciesManagementProps {
  initialBlacklistedCryptos: BlacklistedCryptocurrency[];
}

export default function BlacklistedCryptocurrenciesManagement({
  initialBlacklistedCryptos,
}: BlacklistedCryptocurrenciesManagementProps) {
  const [blacklistedCryptos, setBlacklistedCryptos] = useState<
    BlacklistedCryptocurrency[]
  >(initialBlacklistedCryptos);
  const [isLoading, setIsLoading] = useState(false);

  const handleRemoveFromBlacklist = async (id: number) => {
    setIsLoading(true);
    try {
      await removeFromBlacklist(id);
      // Remove cryptocurrency from state
      setBlacklistedCryptos(
        blacklistedCryptos.filter((crypto) => crypto.cmc_id !== id)
      );
      // TODO: Add toast notification
      console.log("Cryptocurrency removed from blacklist successfully");
    } catch (error) {
      console.error("Failed to remove cryptocurrency from blacklist:", error);
      // TODO: Add toast notification
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BlacklistedCryptoTable
      blacklistedCryptos={blacklistedCryptos}
      isLoading={isLoading}
      onRemove={handleRemoveFromBlacklist}
    />
  );
}
