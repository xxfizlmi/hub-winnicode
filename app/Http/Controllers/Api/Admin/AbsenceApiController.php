<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Absence;
use App\Models\Verification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AbsenceApiController extends Controller
{
     public function index()
    {
        $absences = Absence::with(['participant.user', 'participant.mentor.user'])->get();

        return response()->json($absences);
    }

    public function verify(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:approved,rejected',
        ]);

        $mentorId = optional(Auth::user()->mentor)->id;

        Verification::updateOrCreate(
            ['absence_id' => $id],
            [
                'status' => $request->status,
                'note' => $request->status === 'approved'
                    ? 'Disetujui oleh ' . ($mentorId ? 'mentor' : 'admin')
                    : 'Ditolak oleh ' . ($mentorId ? 'mentor' : 'admin'),
                'mentor_id' => $mentorId,
            ]
        );

        return response()->json([
            'message' => 'Verifikasi berhasil',
        ]);
    }
}
