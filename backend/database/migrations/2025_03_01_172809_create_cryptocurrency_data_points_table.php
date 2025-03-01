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
        Schema::create('cryptocurrency_data_points', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('cryptocurrency_id')->comment('CoinMarketCap ID of the cryptocurrency');
            $table->string('symbol', 20);
            $table->string('name', 100);
            $table->decimal('price', 30, 10);
            $table->decimal('volume_24h', 30, 2)->nullable();
            $table->decimal('market_cap', 30, 2)->nullable();
            $table->decimal('percent_change_1h', 10, 4)->nullable();
            $table->decimal('percent_change_24h', 10, 4)->nullable();
            $table->decimal('percent_change_7d', 10, 4)->nullable();
            $table->decimal('percent_change_30d', 10, 4)->nullable();
            $table->decimal('percent_change_90d', 10, 4)->nullable();
            $table->string('currency', 10)->default('USD');
            $table->timestamp('timestamp')->useCurrent();
            $table->timestamps();
            
            // Create indexes for faster queries
            $table->index('cryptocurrency_id');
            $table->index('symbol');
            $table->index('timestamp');
            
            // Composite index for querying historical data for a specific cryptocurrency
            $table->index(['cryptocurrency_id', 'timestamp']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cryptocurrency_data_points');
    }
};
