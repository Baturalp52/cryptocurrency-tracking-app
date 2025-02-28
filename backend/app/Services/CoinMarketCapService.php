<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

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
            // First get a larger list of cryptocurrencies
            $response = Http::withHeaders($this->defaultHeaders)
                ->get($this->baseUrl . '/v1/cryptocurrency/listings/latest', [
                    'limit' => 100, // Get a larger set to filter from
                    'convert' => $convert,
                ]);

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
                
                // Limit the results
                $filteredData = array_slice(array_values($filteredData), 0, $limit);
                
                // Return the filtered data
                $data['data'] = $filteredData;
                return $data;
            }

            Log::error('CoinMarketCap API error: ' . $response->body());
            return null;
        } catch (\Exception $e) {
            Log::error('CoinMarketCap API exception: ' . $e->getMessage());
            return null;
        }
    }
} 