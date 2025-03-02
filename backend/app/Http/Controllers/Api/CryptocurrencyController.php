<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\BlacklistedCryptocurrencyService;
use App\Services\CoinMarketCapService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Laravel\Sanctum\PersonalAccessToken;

class CryptocurrencyController extends Controller
{
    protected $coinMarketCapService;
    protected $blacklistService;

    public function __construct(
        CoinMarketCapService $coinMarketCapService,
        BlacklistedCryptocurrencyService $blacklistService
    ) {
        $this->coinMarketCapService = $coinMarketCapService;
        $this->blacklistService = $blacklistService;
    }

    /**
     * Get the authenticated user from the request
     * 
     * @param Request $request
     * @return \App\Models\User|null
     */
    protected function getAuthenticatedUser(Request $request)
    {
        // First try the standard way
        $user = $request->user();
        
        // If that doesn't work and we have a token, try to authenticate manually
        if (!$user && $request->bearerToken()) {
            try {
                $token = PersonalAccessToken::findToken($request->bearerToken());
                if ($token) {
                    $user = $token->tokenable;
                    
                    // Ensure the user model is loaded correctly
                    if ($user) {
                        // Log successful manual authentication
                        Log::info('Manually authenticated user:', [
                            'user_id' => $user->id,
                            'email' => $user->email,
                            'role' => $user->role ? $user->role->value : 'null',
                            'token_id' => $token->id
                        ]);
                    } else {
                        Log::warning('Token found but user is null', [
                            'token_id' => $token->id,
                            'tokenable_type' => $token->tokenable_type,
                            'tokenable_id' => $token->tokenable_id
                        ]);
                    }
                } else {
                    Log::warning('Invalid token provided', [
                        'token' => substr($request->bearerToken(), 0, 10) . '...'
                    ]);
                }
            } catch (\Exception $e) {
                Log::error('Error manually authenticating user:', [
                    'error' => $e->getMessage(),
                    'token' => substr($request->bearerToken(), 0, 10) . '...',
                    'trace' => $e->getTraceAsString()
                ]);
            }
        } else if (!$user) {
            Log::info('No authentication token provided');
        }
        
        return $user;
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
        
        // Determine if blacklist should be applied based on user role
        $user = $this->getAuthenticatedUser($request);
        $isAdmin = $user && $user->hasAdminAccess();
        $applyBlacklist = !$isAdmin;

        $data = $this->coinMarketCapService->getTopCryptocurrencies($limit, $convert);

        if ($data === null) {
            return response()->json(['message' => 'Failed to fetch top cryptocurrency data'], 500);
        }

        // Filter out blacklisted cryptocurrencies if needed
        if ($applyBlacklist && isset($data['data'])) {
            $filteredData = $this->blacklistService->filterBlacklistedCryptocurrencies($data['data'], true);
            $data['data'] = array_values($filteredData); // Reset array keys after filtering
            if (isset($data['status']) && isset($data['status']['total_count'])) {
                $data['status']['total_count'] = count($data['data']); // Update total count in status
            }
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
        
        // Determine if blacklist should be applied based on user role
        $user = $this->getAuthenticatedUser($request);
        $isAdmin = $user && $user->hasAdminAccess();
        $applyBlacklist = !$isAdmin;

        // Check if the cryptocurrency is blacklisted
        $isBlacklisted = $this->blacklistService->isBlacklistedById($id) || 
                         $this->blacklistService->isBlacklistedBySymbol($id);
        
        // If blacklisted and not an admin, return 403
        if ($applyBlacklist && $isBlacklisted) {
            return response()->json(['message' => 'This cryptocurrency has been blacklisted'], 403);
        }

        $data = $this->coinMarketCapService->getCryptocurrency($id, $convert);

        if ($data === null) {
            return response()->json(['message' => 'Failed to fetch cryptocurrency data'], 500);
        }

        // If the cryptocurrency is blacklisted and the user is an admin, include the blacklisted information
        if ($isBlacklisted && $isAdmin) {
            // Get blacklisted info from database
            $blacklistedInfo = null;
            
            // First try by ID
            $blacklistedCrypto = \App\Models\BlacklistedCryptocurrency::where('cmc_id', $id)->first();
            
            // If not found, try by symbol
            if (!$blacklistedCrypto && isset($data['data']['symbol'])) {
                $blacklistedCrypto = \App\Models\BlacklistedCryptocurrency::where('symbol', $data['data']['symbol'])->first();
            }
            
            if ($blacklistedCrypto) {
                // Include blacklisted user info if available
                if ($blacklistedCrypto->blacklisted_by) {
                    $blacklistedCrypto->load('blacklistedByUser');
                }
                
                // Add blacklisted info to the response
                $data['data']['blacklisted'] = $blacklistedCrypto;
            }
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
        
        // Determine if blacklist should be applied based on user role
        $user = $this->getAuthenticatedUser($request);
        
        // Enhanced logging for debugging
        Log::info('Authentication debug info:', [
            'user' => $user ? $user->toArray() : null,
        ]);
        
        $isAdmin = $user && $user->hasAdminAccess();
        $applyBlacklist = !$isAdmin;

        if (empty($query)) {
            return response()->json(['message' => 'Search query parameter is required'], 400);
        }

        $data = $this->coinMarketCapService->searchCryptocurrencies(
            $query, 
            $limit, 
            $convert, 
            $sortField, 
            $sortDirection
        );

        if ($data === null) {
            return response()->json(['message' => 'Failed to search cryptocurrencies'], 500);
        }

        // Filter out blacklisted cryptocurrencies if needed
        if ($applyBlacklist && isset($data['data'])) {
            $filteredData = $this->blacklistService->filterBlacklistedCryptocurrencies($data['data'], true);
            $data['data'] = array_values($filteredData); // Reset array keys after filtering
            $data['total'] = count($data['data']); // Update total count
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
        
        // Determine if blacklist should be applied based on user role
        $user = $this->getAuthenticatedUser($request);
        $isAdmin = $user && $user->hasAdminAccess();
        $applyBlacklist = !$isAdmin;
        
        $data = $this->coinMarketCapService->getTrendingCryptocurrencies(
            $limit, 
            $convert, 
            $sortField, 
            $sortDirection
        );
        
        if ($data === null) {
            return response()->json(['message' => 'Failed to fetch trending cryptocurrencies'], 500);
        }
        
        // Filter out blacklisted cryptocurrencies if needed
        if ($applyBlacklist && isset($data['data'])) {
            $filteredData = $this->blacklistService->filterBlacklistedCryptocurrencies($data['data'], true);
            $data['data'] = array_values($filteredData); // Reset array keys after filtering
            $data['total'] = count($data['data']); // Update total count
        }
        
        return response()->json($data);
    }
    
    /**
     * Get historical price data for a cryptocurrency
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getHistoricalData(Request $request, $id)
    {
        $timeRange = $request->input('timeRange', '7d');
        $convert = $request->input('convert', 'USD');
        
        // Determine if blacklist should be applied based on user role
        $user = $this->getAuthenticatedUser($request);
        $isAdmin = $user && $user->hasAdminAccess();
        $applyBlacklist = !$isAdmin;
        
        // Validate time range
        $validTimeRanges = ['1h', '1d', '7d', '30d', '90d', '365d'];

        if (!in_array($timeRange, $validTimeRanges)) {
            return response()->json(['message' => 'Invalid time range. Valid options are: ' . implode(', ', $validTimeRanges)], 400);
        }
        
        // Check if the cryptocurrency is blacklisted
        $isBlacklisted = $this->blacklistService->isBlacklistedById($id) || 
                         $this->blacklistService->isBlacklistedBySymbol($id);
        
        // If blacklisted and not an admin, return 403
        if ($applyBlacklist && $isBlacklisted) {
            return response()->json(['message' => 'This cryptocurrency has been blacklisted'], 403);
        }
        
        $data = $this->coinMarketCapService->getHistoricalData($id, $timeRange, $convert);
        
        if ($data === null) {
            return response()->json(['message' => 'Failed to fetch historical data'], 500);
        }
        
        return response()->json($data);
    }
} 