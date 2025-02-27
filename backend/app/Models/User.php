<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Enums\UserRole;
use Illuminate\Database\Eloquent\Factories\HasFactory;
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
}
