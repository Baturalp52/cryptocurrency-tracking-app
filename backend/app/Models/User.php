<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Enums\UserRole;
use App\Enums\UserStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'status',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'role' => UserRole::class,
            'status' => UserStatus::class,
        ];
    }

    /**
     * Check if user is admin
     *
     * @return bool
     */
    public function isAdmin(): bool
    {
        return $this->role->isAdmin();
    }

    /**
     * Check if user is member
     *
     * @return bool
     */
    public function isMember(): bool
    {
        return $this->role->isMember();
    }

    /**
     * Check if user is active
     *
     * @return bool
     */
    public function isActive(): bool
    {
        return $this->status->isActive();
    }

    /**
     * Check if user is banned
     *
     * @return bool
     */
    public function isBanned(): bool
    {
        return $this->status->isBanned();
    }

    /**
     * Check if user has admin access
     * This method is more robust and handles cases where role might be null
     *
     * @return bool
     */
    public function hasAdminAccess(): bool
    {
        if (!isset($this->role)) {
            return false;
        }

        if ($this->role instanceof UserRole) {
            return $this->role->isAdmin();
        }

        if (is_string($this->role)) {
            $role = UserRole::tryFrom($this->role);
            return $role && $role->isAdmin();
        }

        return false;
    }

    /**
     * Get the watchlists for the user.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function watchlists(): HasMany
    {
        return $this->hasMany(Watchlist::class);
    }

    /**
     * Get the default favorites watchlist for the user.
     * Creates one if it doesn't exist.
     *
     * @return \App\Models\Watchlist
     */
    public function favorites(): Watchlist
    {
        $favorites = $this->watchlists()->where('is_default', true)->first();
        
        if (!$favorites) {
            // Check if any other watchlist is marked as default
            $existingDefault = $this->watchlists()->where('is_default', true)->exists();
            
            if ($existingDefault) {
                // This shouldn't happen, but just in case, return the existing default
                return $this->watchlists()->where('is_default', true)->first();
            }
            
            // Create a new default favorites watchlist
            $favorites = $this->watchlists()->create([
                'name' => 'Favorites',
                'is_default' => true,
                'description' => 'Your favorite cryptocurrencies'
            ]);
        }
        
        return $favorites;
    }
}
