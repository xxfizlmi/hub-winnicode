<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Participant;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ParticipantApiController extends Controller
{
    public function index()
    {
        $participants = Participant::with('user')->get();

        return response()->json($participants);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'student_number' => 'required|string|unique:participants,student_number',
            'major' => 'required|string|max:255',
            'company_name' => 'required|string|max:255',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'participant',
        ]);

        $participant = Participant::create([
            'user_id' => $user->id,
            'student_number' => $validated['student_number'],
            'major' => $validated['major'],
            'company_name' => $validated['company_name'],
        ]);

        return response()->json(['message' => 'Peserta ditambahkan', 'data' => $participant], 201);
    }

    public function update(Request $request, $id)
    {
        $participant = Participant::with('user')->findOrFail($id);
        $user = $participant->user;

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:6',
            'student_number' => 'required|string|unique:participants,student_number,' . $id,
            'major' => 'required|string|max:255',
            'company_name' => 'required|string|max:255',
        ]);

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }
        $user->save();

        $participant->update([
            'student_number' => $validated['student_number'],
            'major' => $validated['major'],
            'company_name' => $validated['company_name'],
        ]);

        return response()->json(['message' => 'Peserta diperbarui']);
    }

    public function destroy($id)
    {
        $participant = Participant::findOrFail($id);
        $participant->user()->delete();
        $participant->delete();

        return response()->json(['message' => 'Peserta dihapus']);
    }
}
