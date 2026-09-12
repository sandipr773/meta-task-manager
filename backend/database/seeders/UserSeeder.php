<?php

namespace Database\Seeders;

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $acme = Tenant::where('name', 'Acme Education')->firstOrFail();
        $bright = Tenant::where('name', 'Bright Healthcare')->firstOrFail();

        User::create([
            'name' => 'Acme Admin',
            'email' => 'admin@acme.test',
            'password' => Hash::make('password'),
            'tenant_id' => $acme->id,
        ]);

        User::create([
            'name' => 'Bright Admin',
            'email' => 'admin@bright.test',
            'password' => Hash::make('password'),
            'tenant_id' => $bright->id,
        ]);
    }
}