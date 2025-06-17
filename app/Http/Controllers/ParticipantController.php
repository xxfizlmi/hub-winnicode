<?php

namespace App\Http\Controllers;

use App\Models\Absence;
use App\Models\Mentor;
use App\Models\Participant;
use App\Models\User;
use App\Models\Verification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ParticipantController extends Controller
{
    public $menuItems;
    public function __construct()
    {
        $this->menuItems = [
            [
                'href' => route('participant.dashboard'),
                'i' => 'home',
                'text' => 'Dashboard',
            ],
            [
                'href' => route('participant.absence'),
                'i' => 'calendar',
                'text' => 'Riwayat Absensi',
            ],
            [
                'href' => route('participant.reportParticipant'),
                'i' => 'file-text',
                'text' => 'Laporan',
            ],
            [
                'href' => route('participant.profileParticipant'),
                'i' => 'user',
                'text' => 'Profil',
            ],
            [
                'href' => route('logout'),
                'i' => 'log-out',
                'text' => 'Logout',
            ],
        ];
    }
    public function index()
    {
        $user = Auth::user();

        $participant = $user->participant;


        $rekap = [
            'hadir' => $participant->absences()->where('status', 'present')->count(),
            'izin'  => $participant->absences()->where('status', 'excused')->count(),
            'sakit' => $participant->absences()->where('status', 'sick')->count(),
            'alfa'  => $participant->absences()->where('status', 'absent')->count(),
        ];

        $data = [
            'title'         => 'Dashboard Peserta',
            'name'          => 'Dashboard',
            'partials'      => 'participant.dashboard',
            'jspartials'    => 'participant.js.jsdashboard',
            'total'         => $rekap,
            'icons'         => ['ti ti-users', 'ti ti-user-check', 'ti ti-calendar', 'ti ti-settings'],
            'notifCount'    => Verification::where('status', 'menunggu')->count(),
            'menuItems'     => $this->menuItems,
        ];
        return view('index', $data);
    }


    public function absenceParticipant()
    {
        $user = Auth::user();
        $participant = $user->participant;
        $absences = $participant->absences()->latest()->take(5)->get(); // 5 absensi terakhir
        $absenHariIni = $participant->absences()
            ->whereDate('date', now())
            ->first();
        $data = [
            'title'             => 'Riwayat Absensi Peserta',
            'name'              => 'Riwayat Absensi',
            'partials'          => 'participant.absence',
            'jspartials'        => 'participant.js.absence',
            'recentAbsences'    => $absences,
            'icons'             => ['ti ti-users', 'ti ti-user-check', 'ti ti-calendar', 'ti ti-settings'],
            'notifCount'        => Verification::where('status', 'menunggu')->count(),
            'menuItems'         => $this->menuItems,
            'absenHariIni'      => $absenHariIni,
            'labels'            => [
                'hadir' => 'Hadir',
                'izin' => 'Izin',
                'sakit' => 'Sakit',
                'alfa' => 'Alfa',
                'terlambat' => 'Terlambat', // tambahkan ini
            ],

            'colors'            => [
                'hadir' => 'bg-green-100 text-green-800',
                'izin' => 'bg-yellow-100 text-yellow-800',
                'sakit' => 'bg-blue-100 text-blue-800',
                'alfa' => 'bg-red-100 text-red-800',
                'terlambat' => 'bg-orange-100 text-orange-800', // tambahkan ini
            ],

            'statusMap' => [
                'present' => 'Hadir',
                'late' => 'Terlambat', // tambahkan pemetaan late ke Terlambat
                'excused' => 'Izin',
                'sick' => 'Sakit',
                'absent' => 'Alfa',
            ]
        ];

        return view('index', $data);
    }

    public function storeParticipant(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'status' => 'required|in:present,excused,sick,absent',
            'activity' => 'nullable|string|max:255',
            'check_in' => 'nullable|date_format:H:i',
            'check_out' => 'nullable|date_format:H:i',
            'file' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
        ]);

        $user = Auth::user();
        $participant = $user->participant;

        // Cek apakah sudah absen hari ini
        $existing = Absence::where('participant_id', $participant->id)
            ->where('date', $request->date)
            ->first();

        if ($existing) {
            return response()->json(['message' => 'Sudah mengisi absensi hari ini'], 409);
        }

        // Aturan jam kerja
        $startWorkTime = '08:00';
        $endWorkTime = '16:00';

        $status = $request->status;

        // Jika status awal Hadir, cek apakah terlambat
        if ($status === 'present' && $request->check_in) {
            if ($request->check_in > $startWorkTime) {
                $status = 'late'; // Ubah status jadi "terlambat"
            }
        }

        // Validasi jam keluar
        if ($request->check_out && $request->check_out < $startWorkTime) {
            return response()->json(['message' => 'Jam keluar hanya boleh diisi setelah jam kerja dimulai (08:00).'], 422);
        }

        $data = [
            'participant_id' => $participant->id,
            'date' => $request->date,
            'status' => $status,
            'activity' => $request->activity,
            'check_in' => $request->check_in,
            'check_out' => $request->check_out,
        ];

        if ($request->hasFile('file')) {
            $data['evidence_file'] = $request->file('file')->store('absensi', 'public');
        }

        Absence::create($data);

        return response()->json(['message' => 'Absensi berhasil disimpan.'], 200);
    }
    public function checkOut(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'check_out' => 'required|date_format:H:i',
        ]);

        $participant = Auth::user()->participant;

        $absen = Absence::where('participant_id', $participant->id)
            ->whereDate('date', $request->date)
            ->first();

        if (!$absen) {
            return response()->json(['message' => 'Absensi masuk belum ditemukan.'], 404);
        }

        $absen->check_out = $request->check_out;
        $absen->save();

        return response()->json(['message' => 'Jam keluar berhasil disimpan.']);
    }
    public function reportParticipant()
    {
        $user = Auth::user();
        $participant = $user->participant;

        $start = $request->start ?? now()->startOfMonth()->toDateString();
        $end = $request->end ?? now()->endOfMonth()->toDateString();

        $absences = $participant->absences()
            ->whereBetween('date', [$start, $end])
            ->orderBy('date')
            ->get();

        $summary = [
            'hadir'     => $absences->where('status', 'present')->count(),
            'terlambat' => $absences->where('status', 'late')->count(),
            'izin'      => $absences->where('status', 'excused')->count(),
            'sakit'     => $absences->where('status', 'sick')->count(),
            'alfa'      => $absences->where('status', 'absent')->count(),
        ];

        $data = [
            'title'         => 'Laporan Absensi Peserta',
            'name'          => 'Laporan',
            'partials'      => 'participant.report',
            'jspartials'    => 'participant.js.report',
            'notifCount'    => Verification::where('status', 'menunggu')->count(),
            'menuItems'     => $this->menuItems,
            'absences'      => $absences,
            'summary'       => $summary,
            'start'         => $start,
            'end'           => $end,

        ];

        return view('index', $data);
    }

    public function profileParticipant()
    {
        $data = [
            'title'         => 'Profil Peserta',
            'name'          => 'Profil',
            'partials'      => 'participant.profile',
            'jspartials'    => 'participant.js.profile',
            'notifCount'    => Verification::where('status', 'menunggu')->count(),
            'menuItems'     => $this->menuItems,
            'participant'   => Auth::user()->participant,
        ];

        return view('index', $data);
    }
    public function updateProfileParticipant(Request $request)
    {
        $participant = Auth::user()->participant;
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'institution' => 'nullable|string|max:255',
            'division' => 'nullable|string|max:255',
        ]);

        $participant->update([
            'name' => $request->name,
            'phone' => $request->phone,
            'institution' => $request->institution,
            'division' => $request->division,
        ]);

        return response()->json(['message' => 'Profil berhasil diperbarui']);
    }
}
