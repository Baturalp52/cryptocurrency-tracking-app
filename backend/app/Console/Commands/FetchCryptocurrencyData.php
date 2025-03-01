<?php

namespace App\Console\Commands;

use App\Services\CoinMarketCapService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class FetchCryptocurrencyData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:fetch-cryptocurrency-data {--limit=100 : Number of cryptocurrencies to fetch}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fetch and store cryptocurrency data for historical tracking';

    /**
     * The CoinMarketCap service.
     *
     * @var CoinMarketCapService
     */
    protected $coinMarketCapService;

    /**
     * Create a new command instance.
     *
     * @param CoinMarketCapService $coinMarketCapService
     * @return void
     */
    public function __construct(CoinMarketCapService $coinMarketCapService)
    {
        parent::__construct();
        $this->coinMarketCapService = $coinMarketCapService;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $limit = $this->option('limit');
        $this->info("Fetching data for top {$limit} cryptocurrencies...");

        try {
            // Fetch top cryptocurrencies
            $response = $this->coinMarketCapService->getTopCryptocurrencies($limit);

            if ($response && isset($response['data']) && is_array($response['data'])) {
                $count = count($response['data']);
                $this->info("Successfully fetched and stored data for {$count} cryptocurrencies.");
                Log::info("Cryptocurrency data fetch command completed successfully. Fetched {$count} cryptocurrencies.");
            } else {
                $this->error("Failed to fetch cryptocurrency data.");
                Log::error("Cryptocurrency data fetch command failed. No data returned from API.");
            }
        } catch (\Exception $e) {
            $this->error("Error fetching cryptocurrency data: " . $e->getMessage());
            Log::error("Cryptocurrency data fetch command error: " . $e->getMessage());
        }

        return Command::SUCCESS;
    }
} 