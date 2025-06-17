<?php

namespace App\Http\Controllers;

use App\Models\Absence;
use App\Models\Mentor;
use App\Models\Participant;

use App\Models\User;
use App\Models\Verification;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class AdminController extends Controller
{
    public $menuItems;
    public function __construct()
    {
        $this->menuItems = [
            [
                'href' => route("admin.dashboard"),
                'i' => 'home',
                'text' => 'Dashboard',
            ],
            [
                'href' => route('admin.participant'),
                'i' => 'users',
                'text' => 'Peserta',
            ],
            [
                'href' => route('admin.mentor'),
                'i' => 'user-check',
                'text' => 'Mentor',
            ],
            [
                'href' => route('admin.assignment'),
                'i' => 'user-plus',
                'text' => 'Penugasan',
            ],
            [
                'href' => route('admin.absence'),
                'i' => 'calendar',
                'text' => 'Data Absensi',
            ],
            [
                'href' => route('admin.report'),
                'i' => 'file-text',
                'text' => 'Laporan',
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
            'jspartials' => 'admin.js.jsdashboard',
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
    public function getWeeklySummary()
    {

        $startDate = Carbon::parse($request->start ?? Carbon::now()->startOfMonth());
        $endDate = Carbon::parse($request->end ?? Carbon::now()->endOfMonth());

        $absences = Absence::whereBetween('date', [$startDate, $endDate])
            ->get()
            ->groupBy(function ($item) {
                return Carbon::parse($item->date)->startOfWeek()->format('Y-m-d');
            });

        $weeklyData = [];

        foreach ($absences as $week => $records) {
            $weeklyData[] = [
                'week' => $week,
                'present' => $records->where('status', 'present')->count(),
                'excused' => $records->where('status', 'excused')->count(),
                'sick' => $records->where('status', 'sick')->count(),
                'absent'  => $records->where('status', 'absent')->count(),
            ];
        }

        return response()->json($weeklyData);
    }
    public function participant()
    {
        $participants = Participant::with('user')->get();
        $data = [
            'title' => 'Hub Winnicode',
            'name' => 'Peserta',
            'partials' => 'admin.participant',
            'jspartials' => 'admin.js.participant',
            'notifCount' => Verification::where('status', 'menunggu')->count(),
            'form' => [
                ['Nama Peserta', 'text', 'name'],
                ['Nomor Peserta', 'number', 'student_number'],
                ['Jurusan', 'text', 'major'],
                ['Instansi', 'text', 'company_name'],
                ['Email', 'email', 'email'],
                ['Password', 'password', 'password']
            ],
            'icons' => ['ti ti-users', 'ti ti-user-check', 'ti ti-calendar', 'ti ti-settings'],
            'menuItems' => $this->menuItems,
            'td' => $participants,
        ];
        return view('index', $data);
    }
    public function storeParticipant(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'student_number' => 'required|string|max:20|unique:participants,student_number',
            'major' => 'required|string|max:255',
            'company_name' => 'required|string|max:255',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
        ]);

        Participant::create([
            'user_id' => $user->id,
            'student_number' => $validated['student_number'],
            'major' => $validated['major'],
            'company_name' => $validated['company_name'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Data peserta berhasil ditambahkan.',
        ]);
    }
    public function updateParticipant(Request $request, $id)
    {
        try {
            $student = Participant::with('user')->findOrFail($id);
            $user = $student->user;

            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email,' . $user->id,
                'password' => 'nullable|string|min:6',
                'student_number' => 'required|string|max:20|unique:participants,student_number,' . $id,
                'major' => 'required|string|max:255',
                'company_name' => 'required|string|max:255',
            ]);

            $user->name = $validated['name'];
            $user->email = $validated['email'];

            if (!empty($validated['password'])) {
                $user->password = bcrypt($validated['password']);
            }

            $user->save();

            $student->update([
                'student_number' => $validated['student_number'],
                'major' => $validated['major'],
                'company_name' => $validated['company_name'],
                'role' => 'participant',
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Data peserta berhasil diperbarui.'
            ]);
        } catch (\Exception $e) {
            Log::error('Update error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal memperbarui data.'
            ], 500);
        }
    }
    public function deleteParticipant($id)
    {
        try {
            $participants = Participant::findOrFail($id);
            $participants->user()->delete(); // hapus user terkait
            $participants->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Data mahasiswa berhasil dihapus.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat menghapus.'
            ], 500);
        }
    }

    public function mentor()
    {
        $mentors = Mentor::with('user')->get();
        $data = [
            'title' => 'Hub Winnicode',
            'name' => 'Mentor',
            'partials' => 'admin.mentor',
            'jspartials' => 'admin.js.mentor',
            'notifCount' => Verification::where('status', 'menunggu')->count(),
            'form' => [
                ['Nama Mentor', 'text', 'name'],
                ['Perusahaan', 'text', 'organization_name'],
                ['Email', 'email', 'email'],
                ['Password', 'password', 'password']
            ],
            'menuItems' => $this->menuItems,
            'td' => $mentors,
        ];
        return view('index', $data);
    }
    public function storeMentor(Request $request)
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
            'password' => bcrypt($validated['password']),
            'role' => 'mentor',
        ]);

        Mentor::create([
            'user_id' => $user->id,
            'organization_name' => $validated['organization_name'],
        ]);

        return response()->json(['status' => 'success', 'message' => 'Data pembimbing berhasil ditambahkan.']);
    }

    public function updateMentor(Request $request, $id)
    {
        try {
            $mentor = Mentor::findOrFail($id);
            $user = $mentor->user;

            if (!$user) {
                return response()->json(['status' => 'error', 'message' => 'User terkait tidak ditemukan.'], 404);
            }

            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email,' . $user->id,
                'password' => 'sometimes|nullable|string|min:6',
                'organization_name' => 'required|string|max:255',
            ]);

            $user->name = $validated['name'];
            $user->email = $validated['email'];
            $user->role = 'Mentor';
            if (!empty($validated['password'])) {
                $user->password = bcrypt($validated['password']);
            }
            $user->save();

            $mentor->update([
                'organization_name' => $validated['organization_name']
            ]);

            return response()->json(['status' => 'success', 'message' => 'Data Mentor berhasil diperbarui.']);
        } catch (\Exception $e) {
            Log::error('Update Mentor Error: ' . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => 'Terjadi kesalahan saat memperbarui.'], 500);
        }
    }

    public function deleteMentor($id)
    {
        try {
            $mentor = Mentor::findOrFail($id);
            $mentor->user()->delete();
            $mentor->delete();

            return response()->json(['status' => 'success', 'message' => 'Data pembimbing berhasil dihapus.']);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Gagal menghapus data pembimbing.'], 500);
        }
    }
    public function assignment()
    {
        $participants = Participant::with(['user', 'mentor.user'])->get();
        $mentors = Mentor::with('user')->get();
        $mentorOptions = $mentors->map(function ($mentor) {
            return [
                'id' => $mentor->id,
                'name' => $mentor->user->name
            ];
        })->toArray();

        $data = [
            'title' => 'Hub Winnicode',
            'name' => 'Penugasan',
            'partials' => 'admin.assignment',
            'jspartials' => 'admin.js.assignment',
            'notifCount' => Verification::where('status', 'menunggu')->count(),
            'form' => [
                ['Nama Mentor', 'text', 'name'],
                ['Perusahaan', 'text', 'organization_name'],
                ['Email', 'email', 'email'],
                ['Password', 'password', 'password']
            ],
            'menuItems' => $this->menuItems,
            'td' => $participants,
            'mentorOptions' => $mentorOptions,
        ];
        return view('index', $data);
    }
    public function storeAssignment(Request $request, $id)
    {

        $participants = Participant::findOrFail($id);
        $participants->mentor_id = $request->mentor_id;
        $participants->save();

        return response()->json(['status' => 'success', 'message' => 'Pembimbing berhasil ditugaskan.']);
    }
    public function absence()
    {
        $absences = Absence::with(['participant.user', 'participant.mentor.user'])->get();

        $data = [
            'title' => 'Hub Winnicode',
            'name' => 'Absensi',
            'partials' => 'admin.absence',
            'jspartials' => 'admin.js.absence',
            'notifCount' => Verification::where('status', 'menunggu')->count(),

            'menuItems' => $this->menuItems,
            'td' => $absences,
        ];
        return view('index', $data);
    }
    public function verifyAbsence(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:approved,rejected',
        ]);

        $user = Auth::user();
        $mentorId = optional($user->mentor)->id; // NULL kalau bukan mentor

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
            'status' => 'success',
            'message' => 'Verifikasi berhasil',
        ]);
    }
    public function reportAdmin(Request $request)
    {
        $query = Absence::with('participant.user');

        if ($request->start && $request->end) {
            $query->whereBetween('date', [$request->start, $request->end]);
        }

        $absences = $query->get();

        $summary = $absences->groupBy('participant_id')->map(function ($absences) {
            $participants = $absences->first()->participant;


            // Gunakan object (Collection) bukan array
            return (object) [
                'user' => $participants->user,
                'student_number' => $participants->student_number,
                'major' => $participants->major,
                'company_name' => $participants->company_name,
                'rekap' => [
                    'preesent' => $absences->where('status', 'present')->count(),
                    'excused' => $absences->where('status', 'excused')->count(),
                    'sick' => $absences->where('status', 'sick')->count(),
                    'absent' => $absences->where('status', 'absent')->count(),
                ]
            ];
        })->values();

        $data = [
            'title' => 'Hub Winnicode',
            'name' => 'Laporan Absensi',
            'partials' => 'admin.report',
            'jspartials' => 'admin.js.report',
            'notifCount' => Verification::where('status', 'pending')->count(),

            'menuItems' => $this->menuItems,
            'td' => $summary,
        ];
        return view('index', $data);
    }

    public function detailAjax($userId)
    {
        $absences = Absence::whereHas('participant', function ($q) use ($userId) {
            $q->where('user_id', $userId);
        })->orderByDesc('date')->get();

        $html = '<table class="table table-bordered text-sm">
        <thead>
            <tr>
                <th>Tanggal</th>
                <th>Jam Masuk</th>
                <th>Jam Keluar</th>
                <th>Aktivitas</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>';

        foreach ($absences as $a) {
            $badge = match ($a->status) {
                'present' => 'bg-green-500 text-white',
                'excused' => 'bg-yellow-500 text-white',
                'sick' => 'bg-blue-500 text-white',
                'absent' => 'bg-red-500 text-white',
                default => 'bg-gray-300 text-gray-800',
            };

            $html .= '<tr>
            <td>' . $a->date . '</td>
            <td>' . $a->check_in  . '</td>
            <td>' . $a->check_out . '</td>
            <td>' . $a->activity . '</td>
            <td><span class="px-2 py-1 rounded ' . $badge . '">' . ucfirst($a->status) . '</span></td>
        </tr>';
        }

        if ($absences->isEmpty()) {
            $html .= '<tr><td colspan="5" class="text-center text-gray-500">Tidak ada data absensi</td></tr>';
        }

        $html .= '</tbody></table>';

        return response($html);
    }
}
