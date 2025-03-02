<?php

namespace App\Enums;

enum UserStatus: string
{
    case ACTIVE = 'ACTIVE';
    case BANNED = 'BANNED';

    /**
     * Get all available statuses as an array
     *
     * @return array
     */
    public static function getValues(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Check if the status is active
     *
     * @return bool
     */
    public function isActive(): bool
    {
        return $this === self::ACTIVE;
    }

    /**
     * Check if the status is banned
     *
     * @return bool
     */
    public function isBanned(): bool
    {
        return $this === self::BANNED;
    }
} 