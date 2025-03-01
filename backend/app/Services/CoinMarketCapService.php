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
    
    // Map our sort fields to CoinMarketCap API sort fields
    protected $sortFieldMap = [
        'name' => 'name',
        'price' => 'price',
        'change24h' => 'percent_change_24h',
        'marketCap' => 'market_cap'
    ];

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
     * @param string $sortField Field to sort by (name, price, change24h, marketCap)
     * @param string $sortDirection Sort direction (asc, desc)
     * @return array|null
     */
    public function searchCryptocurrencies($query, $limit = 20, $convert = 'USD', $sortField = 'marketCap', $sortDirection = 'desc')
    {
        try {
            // For search, we need to fetch a larger set and filter locally
            // because CoinMarketCap API doesn't have a direct search endpoint
            $params = [
                'limit' => 200, // Get a larger set to filter from (increased from 100)
                'convert' => $convert,
            ];
            
            // If the sort field is supported by the API, use it
            if (isset($this->sortFieldMap[$sortField])) {
                $cmcSortField = $this->sortFieldMap[$sortField];
                $params['sort'] = $cmcSortField;
                $params['sort_dir'] = $sortDirection;
            } else {
                // Default to market_cap for sorting if the requested sort isn't available
                $params['sort'] = 'market_cap';
                $params['sort_dir'] = 'desc'; // Highest market cap first
            }
            
            $response = Http::withHeaders($this->defaultHeaders)
                ->get($this->baseUrl . '/v1/cryptocurrency/listings/latest', $params);

            if ($response->successful()) {
                $data = $response->json();
                
                // Filter results by the search query
                $filteredData = array_filter($data['data'], function($crypto) use ($query) {
                    // Search in name, symbol, and slug
                    return (
                        stripos($crypto['name'], $query) !== false ||
                        stripos($crypto['symbol'], $query) !== false ||
                        stripos($crypto['slug'], $query) !== false
                    );
                });
                
                // Format the data for frontend
                $formattedData = $this->formatCryptocurrencyData(array_values($filteredData), $convert);
                
                
                // Limit the results
                $limitedData = array_slice($formattedData, 0, $limit);
                
                // Return the filtered data
                return [
                    'data' => $limitedData,
                    'total' => count($formattedData)
                ];
            }

            Log::error('CoinMarketCap API error: ' . $response->body());
            return null;
        } catch (\Exception $e) {
            Log::error('CoinMarketCap API exception: ' . $e->getMessage());
            return null;
        }
    }
    
    /**
     * Get trending cryptocurrencies
     *
     * @param int $limit Number of results to return
     * @param string $convert Currency to convert prices to
     * @param string $sortField Field to sort by (name, price, change24h, marketCap)
     * @param string $sortDirection Sort direction (asc, desc)
     * @return array|null
     */
    public function getTrendingCryptocurrencies($limit = 20, $convert = 'USD', $sortField = 'marketCap', $sortDirection = 'desc')
    {
        try {
            $params = [
                'limit' => 100, // Get more to have a good selection
                'convert' => $convert,
            ];
            
            // If the requested sort field is supported by the API, use it directly
            if (isset($this->sortFieldMap[$sortField])) {
                $cmcSortField = $this->sortFieldMap[$sortField];
                $params['sort'] = $cmcSortField;
                $params['sort_dir'] = $sortDirection;
            } else {
                // Default to volume_24h for trending if the requested sort isn't available
                $params['sort'] = 'volume_24h';
                $params['sort_dir'] = 'desc'; // Highest volume first
            }
            
            $response = Http::withHeaders($this->defaultHeaders)
                ->get($this->baseUrl . '/v1/cryptocurrency/listings/latest', $params);

            if ($response->successful()) {
                $data = $response->json();
                
                // Format the data for frontend
                $formattedData = $this->formatCryptocurrencyData($data['data'], $convert);
                
                
                // Limit the results
                $limitedData = array_slice($formattedData, 0, $limit);
                
                return [
                    'data' => $limitedData,
                    'total' => count($formattedData)
                ];
            }

            Log::error('CoinMarketCap API error: ' . $response->body());
            return null;
        } catch (\Exception $e) {
            Log::error('CoinMarketCap API exception: ' . $e->getMessage());
            return null;
        }
    }
    
    /**
     * Format cryptocurrency data for frontend
     *
     * @param array $cryptoData Raw cryptocurrency data from API
     * @param string $convert Currency conversion
     * @return array Formatted data
     */
    private function formatCryptocurrencyData($cryptoData, $convert = 'USD')
    {
        return array_map(function($crypto) use ($convert) {
            return [
                'id' => $crypto['id'],
                'name' => $crypto['name'],
                'symbol' => $crypto['symbol'],
                'slug' => $crypto['slug'],
                'rank' => $crypto['cmc_rank'] ?? null,
                'price' => $crypto['quote'][$convert]['price'] ?? 0,
                'change24h' => $crypto['quote'][$convert]['percent_change_24h'] ?? 0,
                'marketCap' => $crypto['quote'][$convert]['market_cap'] ?? null,
                'volume24h' => $crypto['quote'][$convert]['volume_24h'] ?? null,
                'logo' => "https://s2.coinmarketcap.com/static/img/coins/64x64/{$crypto['id']}.png",
            ];
        }, $cryptoData);
    }
}
