<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    /**
     * Display a listing of the users.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $users = User::all();
        
        return response()->json([
            'users' => $users,
        ]);
    }

    /**
     * Store a newly created user in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Password::defaults()],
            'role' => 'required|string|in:' . implode(',', UserRole::getValues()),
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'status' => UserStatus::ACTIVE,
        ]);

        return response()->json([
            'message' => 'User created successfully',
            'user' => $user,
        ], 201);
    }

    /**
     * Update the user's role.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateRole(Request $request, $id)
    {
        $request->validate([
            'role' => 'required|string|in:' . implode(',', UserRole::getValues()),
        ]);

        $user = User::findOrFail($id);
        $user->role = $request->role;
        $user->save();

        return response()->json([
            'message' => 'User role updated successfully',
            'user' => $user,
        ]);
    }

    /**
     * Update the user's status.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|string|in:' . implode(',', UserStatus::getValues()),
        ]);

        $user = User::findOrFail($id);
        
        // Prevent changing your own status
        if ($user->id === auth()->id()) {
            return response()->json([
                'message' => 'You cannot change your own status',
            ], 403);
        }
        
        $user->status = $request->status;
        $user->save();

        $statusMessage = $user->status === UserStatus::BANNED ? 'banned' : 'activated';

        return response()->json([
            'message' => "User {$statusMessage} successfully",
            'user' => $user,
        ]);
    }

    /**
     * Ban a user.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function ban($id)
    {
        $user = User::findOrFail($id);
        
        // Prevent banning yourself
        if ($user->id === auth()->id()) {
            return response()->json([
                'message' => 'You cannot ban your own account',
            ], 403);
        }
        
        // Check if user is already banned
        if ($user->isBanned()) {
            return response()->json([
                'message' => 'User is already banned',
            ], 400);
        }
        
        $user->status = UserStatus::BANNED;
        $user->save();

        return response()->json([
            'message' => 'User banned successfully',
            'user' => $user,
        ]);
    }

    /**
     * Unban a user.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function unban($id)
    {
        $user = User::findOrFail($id);
        
        // Check if user is already active
        if ($user->isActive()) {
            return response()->json([
                'message' => 'User is already active',
            ], 400);
        }
        
        $user->status = UserStatus::ACTIVE;
        $user->save();

        return response()->json([
            'message' => 'User unbanned successfully',
            'user' => $user,
        ]);
    }

    /**
     * Remove the specified user from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        
        // Prevent deleting yourself
        if ($user->id === auth()->id()) {
            return response()->json([
                'message' => 'You cannot delete your own account',
            ], 403);
        }
        
        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully',
        ]);
    }
}
