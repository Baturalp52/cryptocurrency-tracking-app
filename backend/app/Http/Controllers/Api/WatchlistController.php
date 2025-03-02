<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Watchlist;
use App\Models\WatchlistCryptocurrency;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class WatchlistController extends Controller
{
    /**
     * Get all watchlists for the authenticated user
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $user = Auth::user();
        $watchlists = $user->watchlists()->with('cryptocurrencies')->orderBy('created_at', 'asc')->get();
        
        return response()->json($watchlists);
    }

    /**
     * Get a specific watchlist by ID
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $user = Auth::user();
        $watchlist = $user->watchlists()->with('cryptocurrencies')->find($id);
        
        if (!$watchlist) {
            return response()->json(['message' => 'Watchlist not found'], 404);
        }
        
        return response()->json($watchlist);
    }

    /**
     * Create a new watchlist
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_default' => 'nullable|boolean'
        ]);
        
        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()], 422);
        }
        
        $user = Auth::user();
        
        // Check if the user is trying to create a default watchlist
        $isDefault = $request->is_default ?? false;
        
        if ($isDefault) {
            // Check if the user already has a default watchlist
            $existingDefault = $user->watchlists()->where('is_default', true)->first();
            
            if ($existingDefault) {
                return response()->json([
                    'message' => 'You already have a default watchlist. Only one default watchlist is allowed.'
                ], 422);
            }
        }
        
        $watchlist = $user->watchlists()->create([
            'name' => $request->name,
            'description' => $request->description,
            'is_default' => $isDefault
        ]);

        $watchlist = $user->watchlists()->with('cryptocurrencies')->find($watchlist->id);
        
        return response()->json($watchlist, 201);
    }

    /**
     * Update a watchlist
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_default' => 'nullable|boolean'
        ]);
        
        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()], 422);
        }
        
        $user = Auth::user();
        $watchlist = $user->watchlists()->find($id);
        
        if (!$watchlist) {
            return response()->json(['message' => 'Watchlist not found'], 404);
        }
        
        // Don't allow renaming the default favorites list
        if ($watchlist->is_default && $request->name !== 'Favorites') {
            return response()->json(['message' => 'Cannot rename the default Favorites list'], 422);
        }
        
        // Check if the user is trying to set this watchlist as default
        if (isset($request->is_default) && $request->is_default && !$watchlist->is_default) {
            // Check if the user already has a default watchlist
            $existingDefault = $user->watchlists()->where('is_default', true)->first();
            
            if ($existingDefault) {
                return response()->json([
                    'message' => 'You already have a default watchlist. Only one default watchlist is allowed.'
                ], 422);
            }
        }
        
        $updateData = [
            'name' => $request->name,
            'description' => $request->description
        ];
        
        // Only update is_default if it's provided
        if (isset($request->is_default)) {
            $updateData['is_default'] = $request->is_default;
        }
        
        $watchlist->update($updateData);
        
        return response()->json($watchlist);
    }

    /**
     * Delete a watchlist
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $user = Auth::user();
        $watchlist = $user->watchlists()->find($id);
        
        if (!$watchlist) {
            return response()->json(['message' => 'Watchlist not found'], 404);
        }
        
        // Don't allow deleting the default favorites list
        if ($watchlist->is_default) {
            return response()->json(['message' => 'Cannot delete the default Favorites list'], 422);
        }
        
        $watchlist->delete();
        
        return response()->json(['message' => 'Watchlist deleted successfully']);
    }

    /**
     * Get the user's favorites list
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function favorites()
    {
        $user = Auth::user();
        $favorites = $user->favorites()->with('cryptocurrencies')->first();
        
        return response()->json($favorites);
    }

    /**
     * Add a cryptocurrency to a watchlist
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function addCryptocurrency(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'symbol' => 'required|string|max:20',
            'name' => 'required|string|max:255',
            'cmc_id' => 'nullable|integer',
            'notes' => 'nullable|string'
        ]);
        
        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()], 422);
        }
        
        $user = Auth::user();
        $watchlist = $user->watchlists()->find($id);
        
        if (!$watchlist) {
            return response()->json(['message' => 'Watchlist not found'], 404);
        }
        
        // Check if cryptocurrency already exists in this watchlist
        $exists = $watchlist->cryptocurrencies()
            ->where('symbol', $request->symbol)
            ->exists();
            
        if ($exists) {
            return response()->json(['message' => 'Cryptocurrency already exists in this watchlist'], 422);
        }
        
        $crypto = $watchlist->cryptocurrencies()->create([
            'symbol' => $request->symbol,
            'name' => $request->name,
            'cmc_id' => $request->cmc_id,
            'notes' => $request->notes
        ]);
        
        return response()->json($crypto, 201);
    }

    /**
     * Remove a cryptocurrency from a watchlist
     *
     * @param int $id
     * @param string $symbol
     * @return \Illuminate\Http\JsonResponse
     */
    public function removeCryptocurrency($id, $symbol)
    {
        $user = Auth::user();
        $watchlist = $user->watchlists()->find($id);
        
        if (!$watchlist) {
            return response()->json(['message' => 'Watchlist not found'], 404);
        }
        
        $deleted = $watchlist->cryptocurrencies()
            ->where('symbol', $symbol)
            ->delete();
            
        if (!$deleted) {
            return response()->json(['message' => 'Cryptocurrency not found in this watchlist'], 404);
        }
        
        return response()->json(['message' => 'Cryptocurrency removed from watchlist successfully']);
    }

    /**
     * Update notes for a cryptocurrency in a watchlist
     *
     * @param Request $request
     * @param int $id
     * @param string $symbol
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateCryptocurrencyNotes(Request $request, $id, $symbol)
    {
        $validator = Validator::make($request->all(), [
            'notes' => 'nullable|string',
            'cmc_id' => 'nullable|integer'
        ]);
        
        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()], 422);
        }
        
        $user = Auth::user();
        $watchlist = $user->watchlists()->find($id);
        
        if (!$watchlist) {
            return response()->json(['message' => 'Watchlist not found'], 404);
        }
        
        $crypto = $watchlist->cryptocurrencies()
            ->where('symbol', $symbol)
            ->first();
            
        if (!$crypto) {
            return response()->json(['message' => 'Cryptocurrency not found in this watchlist'], 404);
        }
        
        $updateData = ['notes' => $request->notes];
        
        // Only update cmc_id if it's provided
        if ($request->has('cmc_id')) {
            $updateData['cmc_id'] = $request->cmc_id;
        }
        
        $crypto->update($updateData);
        
        return response()->json($crypto);
    }
} 