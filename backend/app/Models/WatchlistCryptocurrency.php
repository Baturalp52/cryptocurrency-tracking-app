<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WatchlistCryptocurrency extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'watchlist_id',
        'symbol',
        'name',
        'cmc_id',
        'added_at',
        'notes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'added_at' => 'datetime',
        'cmc_id' => 'integer',
    ];

    /**
     * Get the watchlist that owns the cryptocurrency.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function watchlist(): BelongsTo
    {
        return $this->belongsTo(Watchlist::class);
    }
} 