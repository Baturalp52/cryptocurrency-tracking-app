<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\Api\CryptocurrencyController;
use App\Http\Controllers\Api\WatchlistController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes
Route::post('/register', [RegisterController::class, 'register']);
Route::post('/login', [LoginController::class, 'login']);

// Public cryptocurrency routes
Route::prefix('cryptocurrencies')->group(function () {
    Route::get('/top', [CryptocurrencyController::class, 'getTopCryptocurrencies']);
    Route::get('/trending', [CryptocurrencyController::class, 'trending']);
    Route::get('/search', [CryptocurrencyController::class, 'searchCryptocurrencies']);
    Route::get('/{symbol}', [CryptocurrencyController::class, 'getCryptocurrency']);
    Route::get('/{id}/historical', [CryptocurrencyController::class, 'getHistoricalData']);
});

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // User routes
    Route::get('/user', [LoginController::class, 'user']);
    Route::post('/logout', [LoginController::class, 'logout']);
    
    
    // Watchlist routes
    Route::prefix('watchlists')->group(function () {
        Route::get('/', [WatchlistController::class, 'index']);
        Route::post('/', [WatchlistController::class, 'store']);
        Route::get('/favorites', [WatchlistController::class, 'favorites']);
        Route::get('/{id}', [WatchlistController::class, 'show']);
        Route::put('/{id}', [WatchlistController::class, 'update']);
        Route::delete('/{id}', [WatchlistController::class, 'destroy']);
        
        // Watchlist cryptocurrency routes
        Route::prefix('{id}/cryptocurrencies')->group(function () {
            Route::post('/', [WatchlistController::class, 'addCryptocurrency']);
            Route::delete('/{symbol}', [WatchlistController::class, 'removeCryptocurrency']);
            Route::put('/{symbol}/notes', [WatchlistController::class, 'updateCryptocurrencyNotes']);
        });
    });
    
    // Admin routes - protected by both auth:sanctum and role:admin middleware
    Route::prefix('admin')
        ->middleware('role:admin')
        ->group(function () {
            Route::get('/users', [AdminController::class, 'users']);
            Route::post('/users/admin', [AdminController::class, 'createAdmin']);
            Route::put('/users/{id}/role', [AdminController::class, 'updateUserRole']);
            Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);
        });
}); 