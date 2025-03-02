<?php

namespace App\Http\Middleware;

use App\Enums\UserStatus;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckBannedStatus
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user() && $request->user()->isBanned()) {
            // Revoke all tokens if the user is banned
            if ($request->user()->tokens) {
                $request->user()->tokens()->delete();
            }
            
            return response()->json([
                'message' => 'Your account has been banned. Please contact the administrator.',
            ], 403);
        }

        return $next($request);
    }
} 