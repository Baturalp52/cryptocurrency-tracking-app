<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@admin.com',
            'password' => Hash::make('admin'),
            'role' => UserRole::ADMIN,
        ]);

        User::create([
            'name' => 'Member User',
            'email' => 'member@member.com',
            'password' => Hash::make('member'),
            'role' => UserRole::MEMBER,
        ]);
    }
}
