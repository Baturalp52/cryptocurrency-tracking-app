<?php

namespace App\Services;

use App\Models\BlacklistedCryptocurrency;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

class BlacklistedCryptocurrencyService
{
    /**
     * Get all blacklisted cryptocurrency IDs
     *
     * @return Collection
     */
    public function getBlacklistedIds(): Collection
    {
        // Cache blacklisted IDs for 1 hour to improve performance
        return Cache::remember('blacklisted_crypto_ids', 3600, function () {
            return BlacklistedCryptocurrency::pluck('cmc_id');
        });
    }

    /**
     * Get all blacklisted cryptocurrency symbols (as a fallback)
     *
     * @return Collection
     */
    public function getBlacklistedSymbols(): Collection
    {
        // Cache blacklisted symbols for 1 hour to improve performance
        return Cache::remember('blacklisted_crypto_symbols', 3600, function () {
            return BlacklistedCryptocurrency::pluck('symbol')->map(function ($symbol) {
                return strtoupper($symbol);
            });
        });
    }

    /**
     * Check if a cryptocurrency is blacklisted by ID
     *
     * @param string $coinId
     * @return bool
     */
    public function isBlacklistedById(string $coinId): bool
    {
        $blacklistedIds = $this->getBlacklistedIds();
        return $blacklistedIds->contains($coinId);
    }

    /**
     * Check if a cryptocurrency is blacklisted by symbol (fallback)
     *
     * @param string $symbol
     * @return bool
     */
    public function isBlacklistedBySymbol(string $symbol): bool
    {
        $symbol = strtoupper($symbol);
        $blacklistedSymbols = $this->getBlacklistedSymbols();
        
        return $blacklistedSymbols->contains($symbol);
    }

    /**
     * Filter out blacklisted cryptocurrencies from a collection
     *
     * @param array $cryptocurrencies
     * @param bool $applyBlacklist
     * @return array
     */
    public function filterBlacklistedCryptocurrencies(array $cryptocurrencies, bool $applyBlacklist = true): array
    {
        // If blacklist should not be applied, return the original data
        if (!$applyBlacklist) {
            return $cryptocurrencies;
        }
        
        $blacklistedIds = $this->getBlacklistedIds();
        $blacklistedSymbols = $this->getBlacklistedSymbols();
        
        // Filter out blacklisted cryptocurrencies
        return array_filter($cryptocurrencies, function ($crypto) use ($blacklistedIds, $blacklistedSymbols) {
            // First try to check by ID (more precise)
            $id = isset($crypto['id']) ? $crypto['id'] : null;
            if ($id && $blacklistedIds->contains($id)) {
                return false;
            }
            
            // Fallback to symbol check if ID is not available or not blacklisted
            $symbol = isset($crypto['symbol']) ? strtoupper($crypto['symbol']) : null;
            if ($symbol && $blacklistedSymbols->contains($symbol)) {
                return false;
            }
            
            // Keep if not blacklisted by either ID or symbol
            return true;
        });
    }

    /**
     * Clear the blacklisted cryptocurrencies cache
     *
     * @return void
     */
    public function clearCache(): void
    {
        Cache::forget('blacklisted_crypto_ids');
        Cache::forget('blacklisted_crypto_symbols');
    }
} 