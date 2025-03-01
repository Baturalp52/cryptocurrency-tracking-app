<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CryptocurrencyDataPoint extends Model
{
    use HasFactory;
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'cryptocurrency_id',
        'symbol',
        'name',
        'price',
        'volume_24h',
        'market_cap',
        'percent_change_1h',
        'percent_change_24h',
        'percent_change_7d',
        'percent_change_30d',
        'percent_change_90d',
        'currency',
        'timestamp',
    ];
    
    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'price' => 'decimal:10',
        'volume_24h' => 'decimal:2',
        'market_cap' => 'decimal:2',
        'percent_change_1h' => 'decimal:4',
        'percent_change_24h' => 'decimal:4',
        'percent_change_7d' => 'decimal:4',
        'percent_change_30d' => 'decimal:4',
        'percent_change_90d' => 'decimal:4',
        'timestamp' => 'datetime',
    ];
}
