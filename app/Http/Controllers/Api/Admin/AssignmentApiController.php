<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Participant;
use Illuminate\Http\Request;

class AssignmentApiController extends Controller
{
    public function index()
    {
        $participants = Participant::with(['user', 'mentor.user'])->get();

        return response()->json($participants);
    }

    public function assign(Request $request, $id)
    {
        $request->validate([
            'mentor_id' => 'required|exists:mentors,id',
        ]);

        $participant = Participant::findOrFail($id);
        $participant->mentor_id = $request->mentor_id;
        $participant->save();

        return response()->json(['message' => 'Mentor berhasil ditugaskan']);
    }
}
