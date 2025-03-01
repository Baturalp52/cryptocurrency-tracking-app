<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\CoinMarketCapService;
use Illuminate\Http\Request;

class CryptocurrencyController extends Controller
{
    protected $coinMarketCapService;

    public function __construct(CoinMarketCapService $coinMarketCapService)
    {
        $this->coinMarketCapService = $coinMarketCapService;
    }

    /**
     * Get top cryptocurrencies
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getTopCryptocurrencies(Request $request)
    {
        $limit = $request->input('limit', 20);
        $convert = $request->input('convert', 'USD');

        $data = $this->coinMarketCapService->getTopCryptocurrencies($limit, $convert);

        if ($data === null) {
            return response()->json(['error' => 'Failed to fetch top cryptocurrency data'], 500);
        }

        return response()->json($data);
    }

    /**
     * Get single cryptocurrency data by symbol
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getCryptocurrency(Request $request, $id)
    {
        $convert = $request->input('convert', 'USD');

        $data = $this->coinMarketCapService->getCryptocurrency($id, $convert);

        if ($data === null) {
            return response()->json(['error' => 'Failed to fetch cryptocurrency data'], 500);
        }

        return response()->json($data);
    }

    /**
     * Search cryptocurrencies by keyword
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function searchCryptocurrencies(Request $request)
    {
        $query = $request->input('query');
        $limit = $request->input('limit', 20);
        $convert = $request->input('convert', 'USD');
        $sortField = $request->input('by', 'marketCap');
        $sortDirection = $request->input('order', 'desc');

        if (empty($query)) {
            return response()->json(['error' => 'Search query parameter is required'], 400);
        }

        $data = $this->coinMarketCapService->searchCryptocurrencies(
            $query, 
            $limit, 
            $convert, 
            $sortField, 
            $sortDirection
        );

        if ($data === null) {
            return response()->json(['error' => 'Failed to search cryptocurrencies'], 500);
        }

        return response()->json($data);
    }

    /**
     * Get trending cryptocurrencies
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function trending(Request $request)
    {
        $limit = $request->input('limit', 20);
        $convert = $request->input('convert', 'USD');
        $sortField = $request->input('by', 'marketCap');
        $sortDirection = $request->input('order', 'desc');
        
        $data = $this->coinMarketCapService->getTrendingCryptocurrencies(
            $limit, 
            $convert, 
            $sortField, 
            $sortDirection
        );
        
        if ($data === null) {
            return response()->json(['error' => 'Failed to fetch trending cryptocurrencies'], 500);
        }
        
        return response()->json($data);
    }
    
} 