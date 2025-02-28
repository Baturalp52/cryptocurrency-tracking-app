<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Watchlist;
use Illuminate\Database\Seeder;

class WatchlistSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all users
        $users = User::all();

        // Create a default favorites watchlist for each user
        foreach ($users as $user) {
            // Check if the user already has any watchlists
            $hasDefault = $user->watchlists()->where('is_default', true)->exists();
            
            if (!$hasDefault) {
                Watchlist::create([
                    'user_id' => $user->id,
                    'name' => 'Favorites',
                    'is_default' => true,
                    'description' => 'Your favorite cryptocurrencies'
                ]);
                
                $this->command->info("Created default favorites watchlist for user: {$user->name}");
            }
        }
    }
} 