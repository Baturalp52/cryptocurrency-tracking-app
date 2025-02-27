<?php

namespace App\Enums;

enum UserRole: string
{
    case ADMIN = 'ADMIN';
    case MEMBER = 'MEMBER';

    /**
     * Get all available roles as an array
     *
     * @return array
     */
    public static function getValues(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Check if the role is admin
     *
     * @return bool
     */
    public function isAdmin(): bool
    {
        return $this === self::ADMIN;
    }

    /**
     * Check if the role is member
     *
     * @return bool
     */
    public function isMember(): bool
    {
        return $this === self::MEMBER;
    }
} 