<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('watchlist_cryptocurrencies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('watchlist_id')->constrained()->onDelete('cascade');
            $table->string('symbol');
            $table->string('name');
            $table->unsignedBigInteger('cmc_id')->nullable();
            $table->timestamp('added_at')->useCurrent();
            $table->text('notes')->nullable();
            $table->timestamps();
            
            // Ensure a cryptocurrency can only be added once to a watchlist
            $table->unique(['watchlist_id', 'symbol'], 'unique_crypto_per_watchlist');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('watchlist_cryptocurrencies');
    }
}; 