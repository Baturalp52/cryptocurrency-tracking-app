<?php

namespace App\Services;

use App\Models\CryptocurrencyDataPoint;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class CryptocurrencyDataService
{
    /**
     * Store a new cryptocurrency data point
     *
     * @param array $data Cryptocurrency data from CoinMarketCap API
     * @param string $currency Currency code (default: USD)
     * @return CryptocurrencyDataPoint|null
     */
    public function storeDataPoint(array $data, string $currency = 'USD'): ?CryptocurrencyDataPoint
    {
        try {
            // Extract the necessary data from the CoinMarketCap API response
            $dataPoint = [
                'cryptocurrency_id' => $data['id'],
                'symbol' => $data['symbol'],
                'name' => $data['name'],
                'price' => $data['quote'][$currency]['price'] ?? 0,
                'volume_24h' => $data['quote'][$currency]['volume_24h'] ?? null,
                'market_cap' => $data['quote'][$currency]['market_cap'] ?? null,
                'percent_change_1h' => $data['quote'][$currency]['percent_change_1h'] ?? null,
                'percent_change_24h' => $data['quote'][$currency]['percent_change_24h'] ?? null,
                'percent_change_7d' => $data['quote'][$currency]['percent_change_7d'] ?? null,
                'percent_change_30d' => $data['quote'][$currency]['percent_change_30d'] ?? null,
                'percent_change_90d' => $data['quote'][$currency]['percent_change_90d'] ?? null,
                'currency' => $currency,
                'timestamp' => Carbon::now(),
            ];

            // Create and return the data point
            return CryptocurrencyDataPoint::create($dataPoint);
        } catch (\Exception $e) {
            Log::error('Error storing cryptocurrency data point: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Get historical data for a cryptocurrency
     *
     * @param int $id Cryptocurrency ID
     * @param string $timeRange Time range (1d, 7d, 30d, 90d, 365d, all)
     * @param string $currency Currency code (default: USD)
     * @return array|null
     */
    public function getHistoricalData(int $id, string $timeRange = '7d', string $currency = 'USD'): ?array
    {
        try {
            // Map time range to days
            $days = $this->mapTimeRangeToDays($timeRange);
            
            // Query the database for historical data
            $query = CryptocurrencyDataPoint::where('cryptocurrency_id', $id)
                ->where('currency', $currency);
                
            // Apply date filter only if days is not -1 (all)
            if ($days > 0) {
                $startDate = Carbon::now()->subDays($days);
                $query->where('timestamp', '>=', $startDate);
            }
            
            // Get the data points ordered by timestamp
            $dataPoints = $query->orderBy('timestamp', 'asc')->get();
            
            // If we don't have enough data points, return null
            if ($dataPoints->count() < 2) {
                return null;
            }
            
            // Format the data for the frontend
            $formattedData = $dataPoints->map(function ($point) {
                return [
                    'timestamp' => $point->timestamp->format('Y-m-d\TH:i:s\Z'),
                    'price' => (float) $point->price,
                    'volume_24h' => $point->volume_24h ? (float) $point->volume_24h : null,
                    'market_cap' => $point->market_cap ? (float) $point->market_cap : null,
                ];
            })->toArray();
            
            // Return the formatted data
            return [
                'data' => $formattedData,
                'metadata' => [
                    'id' => $id,
                    'timeRange' => $timeRange,
                    'interval' => 'variable', // Since we're using actual data points, the interval is variable
                    'convert' => $currency,
                    'is_stored' => true,
                ]
            ];
        } catch (\Exception $e) {
            Log::error('Error retrieving historical data: ' . $e->getMessage());
            return null;
        }
    }
    
    /**
     * Map time range to number of days
     *
     * @param string $timeRange Time range (1h, 1d, 7d, 30d, 90d, 365d)
     * @return int Number of days
     */
    private function mapTimeRangeToDays(string $timeRange): int
    {
        return match ($timeRange) {
            '1h' => 0.0417, // 1 hour = 1/24 of a day
            '1d' => 1,
            '7d' => 7,
            '30d' => 30,
            '90d' => 90,
            '365d' => 365,
            default => 7,
        };
    }
} 