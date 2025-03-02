<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BlacklistedCryptocurrency;
use App\Services\BlacklistedCryptocurrencyService;
use Illuminate\Http\Request;

class BlacklistedCryptocurrencyController extends Controller
{
    protected $blacklistService;

    public function __construct(BlacklistedCryptocurrencyService $blacklistService)
    {
        $this->blacklistService = $blacklistService;
    }

    /**
     * Display a listing of blacklisted cryptocurrencies.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $blacklistedCryptos = BlacklistedCryptocurrency::with('blacklistedByUser')->get();
        
        return response()->json([
            'blacklisted_cryptocurrencies' => $blacklistedCryptos,
        ]);
    }

    /**
     * Store a newly created blacklisted cryptocurrency in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $request->validate([
            'symbol' => 'required|string|max:20',
            'name' => 'nullable|string|max:100',
            'cmc_id' => 'required|string|max:100|unique:blacklisted_cryptocurrencies',
            'reason' => 'nullable|string',
        ]);

        $blacklistedCrypto = BlacklistedCryptocurrency::create([
            'symbol' => strtoupper($request->symbol),
            'name' => $request->name,
            'cmc_id' => $request->cmc_id,
            'reason' => $request->reason,
            'blacklisted_by' => auth()->id(),
        ]);

        // Clear the cache to refresh the blacklisted cryptocurrencies
        $this->blacklistService->clearCache();

        return response()->json([
            'message' => 'Cryptocurrency blacklisted successfully',
            'blacklisted_cryptocurrency' => $blacklistedCrypto,
        ], 201);
    }


    /**
     * Remove the specified blacklisted cryptocurrency from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $blacklistedCrypto = BlacklistedCryptocurrency::where('cmc_id', $id)->firstOrFail();
        $blacklistedCrypto->delete();

        // Clear the cache to refresh the blacklisted cryptocurrencies
        $this->blacklistService->clearCache();

        return response()->json([
            'message' => 'Cryptocurrency removed from blacklist successfully',
        ]);
    }
}
