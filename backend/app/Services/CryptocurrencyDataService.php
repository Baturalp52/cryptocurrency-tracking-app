<?php

namespace App\Services;

use App\Models\CryptocurrencyDataPoint;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

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
     * Get historical data for a cryptocurrency with appropriate time-based aggregation
     *
     * @param int $id Cryptocurrency ID
     * @param string $timeRange Time range (1h, 1d, 7d, 30d, 90d, 365d, all)
     * @param string $currency Currency code (default: USD)
     * @return array|null
     */
    public function getHistoricalData(int $id, string $timeRange = '7d', string $currency = 'USD'): ?array
    {
        try {
            // Map time range to days and get interval information
            $timeInfo = $this->getTimeRangeInfo($timeRange);
            $days = $timeInfo['days'];
            $interval = $timeInfo['interval'];
            $expectedPoints = $timeInfo['expected_points'];
            
            // Calculate start date
            $startDate = Carbon::now()->subDays($days);
            
            // Query the database for historical data
            $query = CryptocurrencyDataPoint::where('cryptocurrency_id', $id)
                ->where('currency', $currency);
                
            // Apply date filter only if days is greater than 0
            if ($days > 0) {
                $query->where('timestamp', '>=', $startDate);
            }
            
            // Get the data points
            $dataPoints = $query->orderBy('timestamp', 'asc')->get();
            
            // If we don't have enough data points, return null
            if ($dataPoints->count() < 2) {
                return null;
            }
            
            // Apply time-based aggregation based on the interval
            $aggregatedData = $this->aggregateDataByInterval($dataPoints, $timeRange, $interval, $startDate);
            
            // If we don't have any valid data points after aggregation, return null
            if (count($aggregatedData) < 1) {
                Log::info('No valid data points found after aggregation for cryptocurrency ID: ' . $id);
                return null;
            }
            
            // Return the formatted data
            return [
                'data' => $aggregatedData,
                'metadata' => [
                    'id' => $id,
                    'timeRange' => $timeRange,
                    'interval' => $interval,
                    'convert' => $currency,
                    'is_stored' => true,
                    'expected_points' => $expectedPoints,
                    'actual_points' => count($aggregatedData),
                ]
            ];
        } catch (\Exception $e) {
            Log::error('Error retrieving historical data: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString()
            ]);
            return null;
        }
    }
    
    /**
     * Get time range information including days, interval, and expected points
     *
     * @param string $timeRange Time range (1h, 1d, 7d, 30d, 90d, 365d)
     * @return array Time range information
     */
    private function getTimeRangeInfo(string $timeRange): array
    {
        return match ($timeRange) {
            '1h' => [
                'days' => 0.0417, // 1 hour = 1/24 of a day
                'interval' => 'minute',
                'expected_points' => 60, // One point per minute
            ],
            '1d' => [
                'days' => 1,
                'interval' => 'hour',
                'expected_points' => 24, // One point per hour
            ],
            '7d' => [
                'days' => 7,
                'interval' => 'day',
                'expected_points' => 7, // One point per day
            ],
            '30d' => [
                'days' => 30,
                'interval' => 'day',
                'expected_points' => 30, // One point per day
            ],
            '90d' => [
                'days' => 90,
                'interval' => 'day',
                'expected_points' => 90, // One point per day
            ],
            '365d' => [
                'days' => 365,
                'interval' => 'day',
                'expected_points' => 365, // One point per day
            ],
            default => [
                'days' => 7,
                'interval' => 'day',
                'expected_points' => 7,
            ],
        };
    }
    
    /**
     * Aggregate data points by the specified interval
     *
     * @param \Illuminate\Support\Collection $dataPoints Collection of data points
     * @param string $timeRange Time range (1h, 1d, 7d, 30d, 90d, 365d)
     * @param string $interval Interval for aggregation (minute, hour, day)
     * @param Carbon $startDate Start date for the data
     * @return array Aggregated data points
     */
    private function aggregateDataByInterval($dataPoints, string $timeRange, string $interval, Carbon $startDate): array
    {
        // If no data points, return empty array
        if ($dataPoints->isEmpty()) {
            return [];
        }
        
        $now = Carbon::now();
        $endDate = $now;
        
        // Group data points by the appropriate interval
        $groupedData = [];
        
        foreach ($dataPoints as $point) {
            if (!$this->isValidDataPoint($point)) {
                continue; // Skip invalid data points
            }
            
            $intervalKey = $this->getIntervalKey($point->timestamp, $interval);
            
            // Keep only the latest point in each interval
            if (!isset($groupedData[$intervalKey]) || 
                $point->timestamp > $groupedData[$intervalKey]->timestamp) {
                $groupedData[$intervalKey] = $point;
            }
        }
        
        // Sort by timestamp and convert to array
        ksort($groupedData);
        
        // Format the data points
        $aggregatedData = [];
        foreach ($groupedData as $point) {
            $aggregatedData[] = $this->formatDataPoint($point);
        }
        
        return $aggregatedData;
    }
    
    /**
     * Get a key representing the interval for a timestamp
     *
     * @param Carbon $timestamp The timestamp
     * @param string $interval The interval type (minute, hour, day)
     * @return string A string key representing the interval
     */
    private function getIntervalKey(Carbon $timestamp, string $interval): string
    {
        switch ($interval) {
            case 'minute':
                // Format: YYYY-MM-DD HH:MM
                return $timestamp->format('Y-m-d H:i');
                
            case 'hour':
                // Format: YYYY-MM-DD HH
                return $timestamp->format('Y-m-d H');
                
            case 'day':
                // Format: YYYY-MM-DD
                return $timestamp->format('Y-m-d');
                
            default:
                return $timestamp->format('Y-m-d H:i:s');
        }
    }
    
    /**
     * Check if a data point is valid (has reasonable values)
     *
     * @param CryptocurrencyDataPoint $point Data point to validate
     * @return bool Whether the data point is valid
     */
    private function isValidDataPoint(CryptocurrencyDataPoint $point): bool
    {
        // Check if price is a reasonable value (not extremely large or negative)
        if (!is_numeric($point->price) || $point->price < 0 || $point->price > 1e10) {
            return false;
        }
        
        // Check volume_24h if it exists
        if ($point->volume_24h !== null && 
            (!is_numeric($point->volume_24h) || $point->volume_24h < 0 || $point->volume_24h > 1e15)) {
            return false;
        }
        
        // Check market_cap if it exists
        if ($point->market_cap !== null && 
            (!is_numeric($point->market_cap) || $point->market_cap < 0 || $point->market_cap > 1e15)) {
            return false;
        }
        
        return true;
    }
    
    /**
     * Format a data point for the response
     *
     * @param CryptocurrencyDataPoint $point Data point to format
     * @return array Formatted data point
     */
    private function formatDataPoint(CryptocurrencyDataPoint $point): array
    {
        return [
            'timestamp' => $point->timestamp->format('Y-m-d\TH:i:s\Z'),
            'price' => (float) $point->price,
            'volume_24h' => $point->volume_24h ? (float) $point->volume_24h : null,
            'market_cap' => $point->market_cap ? (float) $point->market_cap : null,
        ];
    }
    
    /**
     * Map time range to number of days (legacy method kept for compatibility)
     *
     * @param string $timeRange Time range (1h, 1d, 7d, 30d, 90d, 365d)
     * @return float Number of days
     */
    private function mapTimeRangeToDays(string $timeRange): float
    {
        $timeInfo = $this->getTimeRangeInfo($timeRange);
        return $timeInfo['days'];
    }
} 