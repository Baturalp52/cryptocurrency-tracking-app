<?php

namespace App\Http\Middleware;

use App\Enums\UserRole;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  $role
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        if (!$request->user()) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // If role is admin and user is not admin, return unauthorized
        if ($role === 'admin') {
            if (!$request->user()->hasAdminAccess()) {
                return response()->json([
                    'message' => 'Unauthorized. Admin access required.',
                    'status' => 'error'
                ], 403);
            }
        }

        return $next($request);
    }
}
