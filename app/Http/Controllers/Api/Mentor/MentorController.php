<?php

namespace App\Http\Controllers\Api\Mentor;

use App\Http\Controllers\Controller;
use App\Models\Participant;
use App\Models\Verification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MentorController extends Controller
{
    public function dashboard()
    {
        $mentor = Auth::user()->mentor;
        return response()->json([
            'participant_count' => Participant::where('mentor_id', $mentor->id)->count(),
            'pending_verification' => Verification::where('mentor_id', $mentor->id)->where('status', 'menunggu')->count(),
        ]);
    }

    public function participants()
    {
        $mentor = Auth::user()->mentor;
        $participants = Participant::with('user')
            ->where('mentor_id', $mentor->id)
            ->get();

        return response()->json($participants);
    }

    public function verifications(Request $request)
    {
        $mentor = Auth::user()->mentor;

        $query = Verification::with('absence.participant.user')
            ->where('mentor_id', $mentor->id);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        return response()->json($query->orderByDesc('created_at')->get());
    }

    public function updateVerification(Request $request, $id)
    {
        $request->validate(['status' => 'required|in:approved,rejected']);

        $mentor = Auth::user()->mentor;

        $verification = Verification::where('id', $id)
            ->where('mentor_id', $mentor->id)
            ->firstOrFail();

        $verification->status = $request->status;
        $verification->note = $request->status === 'approved'
            ? 'Disetujui oleh mentor'
            : 'Ditolak oleh mentor';
        $verification->save();

        return response()->json(['message' => 'Verifikasi diperbarui.']);
    }

    public function report()
    {
        $mentor = Auth::user()->mentor;

        $participants = Participant::with('user', 'absences')
            ->where('mentor_id', $mentor->id)
            ->get();

        $rekap = $participants->map(function ($p) {
            return [
                'user' => $p->user,
                'student_number' => $p->student_number,
                'major' => $p->major,
                'rekap' => [
                    'present' => $p->absences->where('status', 'present')->count(),
                    'excused' => $p->absences->where('status', 'excused')->count(),
                    'sick' => $p->absences->where('status', 'sick')->count(),
                    'absent' => $p->absences->where('status', 'absent')->count(),
                ]
            ];
        });

        return response()->json($rekap);
    }
}
