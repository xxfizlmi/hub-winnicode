<?php

namespace App\Http\Controllers;

use App\Models\Absence;
use App\Models\Mentor;
use App\Models\Participant;

use App\Models\User;
use App\Models\Verification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class CompanyMentorController extends Controller
{
    public $menuItems;
    use AuthorizesRequests;
    public function __construct()
    {
        $this->menuItems = [
            [
                'href' => route("mentor.dashboard"),
                'i' => 'home',
                'text' => 'Dashboard',
            ],
            [
                'href' => route("mentor.verify"),
                'i' => 'check-square',
                'text' => 'Verifikasi',
            ],
            [
                'href' => route("mentor.history"),
                'i' => 'file-text',
                'text' => 'Riwayat Verifikasi',
            ],
            [
                'href' => route("mentor.participant"),
                'i' => 'users',
                'text' => 'Peserta',
            ],
            [
                'href' => route("mentor.report"),
                'i' => 'bar-chart-2',
                'text' => 'Laporan Kehadiran',
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
        $data = [
            'title' => 'Hub Winnicode',
            'name' => 'Dashboard',
            'partials' => 'dashboard',
            'jspartials' => 'mentor.js.jsdashboard',
            'notifCount' => Verification::where('status', 'menunggu')->count(),
            'total' => [
                ['Peserta', Participant::count()],
                ['Mentor', Mentor::count()],
                ['Absensi', Absence::count()],
                ['User', User::count()],
            ],
            'icons' => ['ti ti-users', 'ti ti-user-check', 'ti ti-calendar', 'ti ti-settings'],
            'menuItems' => $this->menuItems,
        ];
        return view('index', $data);
    }
    public function verifyMentor(Request $request)
    {
        $mentor = Auth::user()->mentor;
        $query = Verification::with('absence.participant.user')
            ->where('mentor_id', $mentor->id);
        $veriy = Verification::with('absence.participant.user')
            ->where('mentor_id', $mentor->id)
            ->orderByDesc('created_at')
            ->get();

        if ($request->has('status') && in_array($request->status, ['pending', 'approved', 'rejected'])) {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $query->whereHas('absence.participant.user', function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%');
            });
        }
        $data = [
            'title' => 'Hub Winnicode',
            'name' => 'Verifikasi',
            'partials' => 'mentor.verify',
            'jspartials' => 'mentor.js.verify',
            'notifCount' => Verification::where('status', 'menunggu')->count(),
            'total' => [
                ['Peserta', Participant::count()],
                ['Mentor', Mentor::count()],
                ['Absensi', Absence::count()],
                ['User', User::count()],
            ],
            'menuItems' => $this->menuItems,
            'td' => $veriy,
        ];
        return view('index', $data);
    }
    public function updateVerification(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,approved,rejected',
        ]);

        $mentor = Auth::user()->mentor;

        $verification = Verification::where('id', $id)
            ->where('mentor_id', $mentor->id)
            ->firstOrFail();

        $verification->status = $request->status;
        $verification->note = match ($request->status) {
            'approved' => 'Disetujui oleh mentor',
            'rejected' => 'Ditolak oleh mentor',
            default => 'Menunggu konfirmasi mentor',
        };
        $verification->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Status verifikasi berhasil diperbarui.'
        ]);
    }

    public function history(Request $request)
    {
        $mentor = Auth::user()->mentor;

        $veriy = Verification::with('absence.participant.user')
            ->where('mentor_id', $mentor->id)
            ->whereIn('status', ['approved', 'rejected'])
            ->orderByDesc('created_at')
            ->get();

        $data = [
            'title' => 'Hub Winnicode',
            'name' => 'Riwayat',
            'partials' => 'mentor.history',
            'jspartials' => 'mentor.js.history',
            'notifCount' => Verification::where('status', 'menunggu')->count(),
            'menuItems' => $this->menuItems,
            'td' => $veriy,
        ];
        return view('index', $data);
    }

    public function participants()
    {
        $mentor = Auth::user()->mentor;

        $participants = Participant::with('user')
            ->where('mentor_id', $mentor->id)
            ->get();

        $data = [
            'title' => 'Hub Winnicode',
            'name' => 'Peserta Bimbingan',
            'partials' => 'mentor.participant',
            'jspartials' => 'mentor.js.participant',
            'notifCount' => Verification::where('status', 'menunggu')->count(),
            'menuItems' => $this->menuItems,
            'td' => $participants,
        ];

        return view('index', $data);
    }

    public function reportMentor(Request $request)
    {
        $mentor = Auth::user()->mentor;

        $participants = Participant::with('user', 'absences')
            ->where('mentor_id', $mentor->id)
            ->get();

        $rekap = $participants->map(function ($p) {
            return (object) [
                'user' => $p->user,
                'student_number' => $p->student_number,
                'major' => $p->major,
                'absences' => [
                    'hadir' => $p->absences->where('status', 'present')->count(),
                    'izin' => $p->absences->where('status', 'excused')->count(),
                    'sakit' => $p->absences->where('status', 'sick')->count(),
                    'alfa' => $p->absences->where('status', 'absent')->count(),
                ]
            ];
        });
        $data = [
            'title' => 'Rekap Kehadiran',
            'name' => 'Verifikasi',
            'partials' => 'mentor.report',
            'jspartials' => 'mentor.js.report',
            'notifCount' => Verification::where('status', 'menunggu')->count(),
            'menuItems' => $this->menuItems,
            'td' => $rekap,
        ];
        return view('index', $data);
    }
    public function reportDetailAjax($userId)
    {
        $absences = Absence::whereHas('participant', function ($q) use ($userId) {
            $q->where('user_id', $userId);
        })->orderByDesc('date')->get();

        $html = '<table class="table table-bordered text-sm">
        <thead>
            <tr>
                <th>Tanggal</th>
                <th>Masuk</th>
                <th>Keluar</th>
                <th>Aktivitas</th>
                <th>Status</th>
            </tr>
        </thead><tbody>';

        foreach ($absences as $a) {
            $badge = match ($a->status) {
                'present' => 'bg-green-500 text-white',
                'excused' => 'bg-yellow-400 text-black',
                'sick' => 'bg-blue-400 text-white',
                'absent' => 'bg-red-500 text-white',
                default => 'bg-gray-300',
            };

            $html .= "<tr>
            <td>{$a->date}</td>
            <td>{$a->check_in}</td>
            <td>{$a->check_out}</td>
            <td>{$a->activity}</td>
            <td><span class='px-2 py-1 rounded {$badge}'>" . ucfirst($a->status) . "</span></td>
        </tr>";
        }

        $html .= '</tbody></table>';
        return response($html);
    }
}
