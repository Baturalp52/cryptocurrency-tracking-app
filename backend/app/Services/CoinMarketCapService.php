<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class CoinMarketCapService
{
    protected $apiKey;
    protected $baseUrl = 'https://pro-api.coinmarketcap.com';
    protected $defaultHeaders;

    public function __construct()
    {
        $this->apiKey = env('CMC_API_KEY');
        $this->defaultHeaders = [
            'X-CMC_PRO_API_KEY' => $this->apiKey,
            'Accept' => 'application/json',
        ];
    }

    /**
     * Get top cryptocurrencies
     *
     * @param int $limit Number of results to return
     * @param string $convert Currency to convert prices to
     * @return array|null
     */
    public function getTopCryptocurrencies($limit = 10, $convert = 'USD')
    {
        try {
            // For top cryptocurrencies, we'll sort by market cap to get the most valuable coins
            $response = Http::withHeaders($this->defaultHeaders)
                ->get($this->baseUrl . '/v1/cryptocurrency/listings/latest', [
                    'limit' => $limit,
                    'convert' => $convert,
                    'sort' => 'market_cap',
                    'sort_dir' => 'desc', // Highest market cap first
                ]);

            if ($response->successful()) {
                return $response->json();
            }

            Log::error('CoinMarketCap API error: ' . $response->body());
            return null;
        } catch (\Exception $e) {
            Log::error('CoinMarketCap API exception: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Get single cryptocurrency data by symbol
     *
     * @param int $id Cryptocurrency id
     * @param string $convert Currency to convert prices to
     * @return array|null
     */
    public function getCryptocurrency($id, $convert = 'USD')
    {
        try {
            $response = Http::withHeaders($this->defaultHeaders)
                ->get($this->baseUrl . '/v2/cryptocurrency/quotes/latest', [
                    'id' => $id,
                    'convert' => $convert,
                ]);

            if ($response->successful()) {
                $data = $response->json();
                
                // Also fetch metadata to get more details
                $metadataResponse = Http::withHeaders($this->defaultHeaders)
                    ->get($this->baseUrl . '/v2/cryptocurrency/info', [
                        'id' => $id,
                    ]);
                
                if ($metadataResponse->successful()) {
                    $metadata = $metadataResponse->json();
                    
                    // Merge the metadata with the quote data
                    if (isset($data['data'][$id]) && isset($metadata['data'][$id])) {
                        $data['data'][$id] = array_merge(
                            $data['data'][$id],
                            [
                                'logo' => $metadata['data'][$id]['logo'] ?? null,
                                'description' => $metadata['data'][$id]['description'] ?? null,
                                'urls' => $metadata['data'][$id]['urls'] ?? null,
                            ]
                        );
                    }
                }

                return ["data" => $data['data'][$id] ];
            }

            Log::error('CoinMarketCap API error: ' . $response->body());
            return null;
        } catch (\Exception $e) {
            Log::error('CoinMarketCap API exception: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Search cryptocurrencies by keyword
     *
     * @param string $query Search query
     * @param int $limit Number of results to return
     * @param string $convert Currency to convert prices to
     * @return array|null
     */
    public function searchCryptocurrencies($query, $limit = 20, $convert = 'USD')
    {
        try {
            // First try to search by symbol
            $symbolResponse = Http::withHeaders($this->defaultHeaders)
                ->get($this->baseUrl . '/v1/cryptocurrency/map', [
                    'symbol' => $query, // Search by symbol
                    'limit' => $limit,
                ]);

            // Also search by name using the same query
            $nameResponse = Http::withHeaders($this->defaultHeaders)
                ->get($this->baseUrl . '/v1/cryptocurrency/map', [
                    'listing_status' => 'active',
                    'limit' => 100, // Get more results to filter
                ]);

            $cryptoIds = [];
            $uniqueIds = [];

            // Process symbol search results
            if ($symbolResponse->successful()) {
                $symbolData = $symbolResponse->json();
                
                if (!empty($symbolData['data'])) {
                    foreach ($symbolData['data'] as $crypto) {
                        if (!in_array($crypto['id'], $uniqueIds)) {
                            $cryptoIds[] = $crypto;
                            $uniqueIds[] = $crypto['id'];
                        }
                    }
                }
            }

            // Process name search results
            if ($nameResponse->successful()) {
                $nameData = $nameResponse->json();
                
                if (!empty($nameData['data'])) {
                    // Filter results by the search query in name or slug
                    $filteredData = array_filter($nameData['data'], function($crypto) use ($query) {
                        return (
                            stripos($crypto['name'], $query) !== false ||
                            stripos($crypto['slug'], $query) !== false
                        );
                    });
                    
                    // Add unique results to our list
                    foreach ($filteredData as $crypto) {
                        if (!in_array($crypto['id'], $uniqueIds)) {
                            $cryptoIds[] = $crypto;
                            $uniqueIds[] = $crypto['id'];
                        }
                    }
                }
            }
            
            // Limit the results to the requested amount
            $cryptoIds = array_slice($cryptoIds, 0, $limit);
            $uniqueIds = array_slice($uniqueIds, 0, $limit);
            
            // If we have cryptocurrency IDs, get their latest quotes
            if (!empty($uniqueIds)) {
                $idsString = implode(',', $uniqueIds);
                
                $quoteResponse = Http::withHeaders($this->defaultHeaders)
                    ->get($this->baseUrl . '/v2/cryptocurrency/quotes/latest', [
                        'id' => $idsString,
                        'convert' => $convert,
                    ]);
                
                if ($quoteResponse->successful()) {
                    $quoteData = $quoteResponse->json();
                    
                    // Get metadata for logos and additional info
                    $metadataResponse = Http::withHeaders($this->defaultHeaders)
                        ->get($this->baseUrl . '/v2/cryptocurrency/info', [
                            'id' => $idsString,
                        ]);
                    
                    $metadata = [];
                    if ($metadataResponse->successful()) {
                        $metadata = $metadataResponse->json()['data'] ?? [];
                    }
                    
                    // Format the results
                    $formattedData = [];
                    foreach ($uniqueIds as $id) {
                        if (isset($quoteData['data'][$id])) {
                            $crypto = $quoteData['data'][$id];
                            $quote = $crypto['quote'][$convert] ?? null;
                            
                            $formattedData[] = [
                                'id' => $crypto['id'],
                                'name' => $crypto['name'],
                                'symbol' => $crypto['symbol'],
                                'slug' => $crypto['slug'],
                                'rank' => $crypto['cmc_rank'] ?? null,
                                'price' => $quote['price'] ?? 0,
                                'change24h' => $quote['percent_change_24h'] ?? 0,
                                'marketCap' => $quote['market_cap'] ?? 0,
                                'volume24h' => $quote['volume_24h'] ?? 0,
                                'logo' => $metadata[$id]['logo'] ?? null,
                            ];
                        }
                    }
                    // Sort formatted data by ID in ascending order
                    usort($formattedData, function($a, $b) {
                        return $a['id'] - $b['id'];
                    });
                        
                    return [
                        'data' => $formattedData,
                        'total' => count($formattedData)
                    ];
                }
            }
            
            // Return empty results if no matches or API error
            return [
                'data' => [],
                'total' => 0
            ];
            
        } catch (\Exception $e) {
            Log::error('CoinMarketCap API exception: ' . $e->getMessage());
            return [
                'data' => [],
                'total' => 0
            ];
        }
    }
} 