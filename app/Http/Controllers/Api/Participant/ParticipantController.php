<?php

namespace App\Http\Controllers\Api\Participant;

use App\Http\Controllers\Controller;
use App\Models\Absence;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ParticipantController extends Controller
{
    public function dashboard()
    {
        $participant = Auth::user()->participant;

        $rekap = [
            'present'   => $participant->absences()->where('status', 'present')->count(),
            'late'      => $participant->absences()->where('status', 'late')->count(),
            'excused'   => $participant->absences()->where('status', 'excused')->count(),
            'sick'      => $participant->absences()->where('status', 'sick')->count(),
            'absent'    => $participant->absences()->where('status', 'absent')->count(),
        ];

        return response()->json([
            'message' => 'Dashboard peserta',
            'rekap' => $rekap
        ]);
    }

    public function absences()
    {
        $participant = Auth::user()->participant;
        $absences = $participant->absences()->latest()->get();

        return response()->json($absences);
    }

    public function storeAbsence(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'status' => 'required|in:present,excused,sick,absent',
            'activity' => 'nullable|string|max:255',
            'check_in' => 'nullable|date_format:H:i',
            'check_out' => 'nullable|date_format:H:i',
        ]);

        $participant = Auth::user()->participant;

        if (Absence::where('participant_id', $participant->id)->where('date', $request->date)->exists()) {
            return response()->json(['message' => 'Sudah absen untuk hari ini'], 409);
        }

        $status = $request->status;

        if ($status === 'present' && $request->check_in > '08:00') {
            $status = 'late';
        }

        $absence = Absence::create([
            'participant_id' => $participant->id,
            'date' => $request->date,
            'status' => $status,
            'activity' => $request->activity,
            'check_in' => $request->check_in,
            'check_out' => $request->check_out,
        ]);

        return response()->json(['message' => 'Absensi berhasil dicatat', 'data' => $absence]);
    }

    public function checkOut(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'check_out' => 'required|date_format:H:i',
        ]);

        $participant = Auth::user()->participant;

        $absence = Absence::where('participant_id', $participant->id)
            ->where('date', $request->date)
            ->first();

        if (!$absence) {
            return response()->json(['message' => 'Absensi tidak ditemukan'], 404);
        }

        $absence->update(['check_out' => $request->check_out]);

        return response()->json(['message' => 'Jam keluar berhasil disimpan']);
    }

    public function report(Request $request)
    {
        $participant = Auth::user()->participant;

        $start = $request->start ?? now()->startOfMonth()->toDateString();
        $end = $request->end ?? now()->endOfMonth()->toDateString();

        $absences = $participant->absences()
            ->whereBetween('date', [$start, $end])
            ->orderBy('date')
            ->get();

        $summary = [
            'present'   => $absences->where('status', 'present')->count(),
            'late'      => $absences->where('status', 'late')->count(),
            'excused'   => $absences->where('status', 'excused')->count(),
            'sick'      => $absences->where('status', 'sick')->count(),
            'absent'    => $absences->where('status', 'absent')->count(),
        ];

        return response()->json([
            'summary' => $summary,
            'data' => $absences,
        ]);
    }

    public function profile()
    {
        return response()->json(Auth::user()->participant);
    }

    public function updateProfile(Request $request)
    {
        $participant = Auth::user()->participant;

        $request->validate([
            'phone' => 'nullable|string|max:20',
            'institution' => 'nullable|string|max:255',
            'division' => 'nullable|string|max:255',
        ]);

        $participant->update($request->only('phone', 'institution', 'division'));

        return response()->json(['message' => 'Profil berhasil diperbarui']);
    }
}
