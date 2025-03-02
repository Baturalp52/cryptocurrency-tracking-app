<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BlacklistedCryptocurrency extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'symbol',
        'name',
        'cmc_id',
        'reason',
        'blacklisted_by',
    ];

    /**
     * Get the user who blacklisted the cryptocurrency.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function blacklistedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'blacklisted_by');
    }
}
