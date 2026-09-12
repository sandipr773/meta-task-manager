<?php

namespace App\Support;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use RuntimeException;

class TenantContext
{
    public function id(): int
    {
        $user = $this->user();

        if (!$user || !$user->tenant_id) {
            throw new RuntimeException(
                'Tenant context is not available.'
            );
        }

        return $user->tenant_id;
    }

    public function user(): ?User
    {
        $user = Auth::user();

        return $user instanceof User ? $user : null;
    }
}