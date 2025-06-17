<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Mentor;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class MentorApiController extends Controller
{
    public function index()
    {
        $mentors = Mentor::with('user')->get();
        return response()->json($mentors);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'organization_name' => 'required|string|max:255',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'mentor',
        ]);

        $mentor = Mentor::create([
            'user_id' => $user->id,
            'organization_name' => $validated['organization_name'],
        ]);

        return response()->json(['message' => 'Mentor ditambahkan', 'data' => $mentor], 201);
    }

    public function update(Request $request, $id)
    {
        $mentor = Mentor::with('user')->findOrFail($id);
        $user = $mentor->user;

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:6',
            'organization_name' => 'required|string|max:255',
        ]);

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }
        $user->save();

        $mentor->update([
            'organization_name' => $validated['organization_name']
        ]);

        return response()->json(['message' => 'Mentor diperbarui']);
    }

    public function destroy($id)
    {
        $mentor = Mentor::findOrFail($id);
        $mentor->user()->delete();
        $mentor->delete();

        return response()->json(['message' => 'Mentor dihapus']);
    }
}
