<?php

namespace Database\Seeders;

use App\Models\Absence;
use App\Models\Participant;
use App\Models\Verification;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DummyAbsensiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void

    {
        $participants = Participant::with('mentor')->get();

        foreach ($participants as $participant) {
            for ($i = 0; $i < 7; $i++) {
                $date = Carbon::now()->subDays($i)->toDateString();

                // Skip jika sudah ada
                if (Absence::where('participant_id', $participant->id)->where('date', $date)->exists()) {
                    continue;
                }

                // Random status
                $rand = rand(1, 100);
                $absenceData = [
                    'participant_id' => $participant->id,
                    'date'    => $date,
                    'activity'  => '',
                ];

                if ($rand <= 70) {
                    $absenceData['check_in']  = '08:00:00';
                    $absenceData['check_out'] = '16:00:00';
                    $absenceData['status']     = 'present';
                    $absenceData['activity']  = 'Belajar Laravel & Tailwind';
                } elseif ($rand <= 85) {
                    $absenceData['status']     = 'excused';
                    $absenceData['activity']  = 'Izin kegiatan keluarga';
                } else {
                    $absenceData['status']     = 'sick';
                    $absenceData['activity']  = 'Sakit flu';
                }

                // Simpan absensi
                $absen = Absence::create($absenceData);

                // Jika sakit atau izin, buat verifikasi
                if (in_array($absenceData['status'], ['excused', 'sick']) && $participant->mentor) {
                    Verification::create([
                        'absence_id' => $absen->id,
                        'mentor_id'  => $participant->mentor->id,
                        'status'     => 'pending',
                        'note'       => 'Perlu konfirmasi pembimbing',
                    ]);
                }
            }
        }
    }
}
