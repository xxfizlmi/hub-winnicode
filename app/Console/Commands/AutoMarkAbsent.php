<?php

namespace App\Console\Commands;

use App\Models\Absence;
use App\Models\Participant;
use Carbon\Carbon;
use Illuminate\Console\Command;

class AutoMarkAbsent extends Command
{

    protected $signature = 'absensi:mark-absent';
    protected $description = 'Tandai peserta yang tidak mengisi absensi hari ini sebagai Alfa';

    public function handle()
    {
        $today = Carbon::today()->toDateString();

        // Ambil semua participant
        $participants = Participant::all();

        foreach ($participants as $participant) {
            $sudahAbsen = $participant->absences()->where('date', $today)->exists();

            if (!$sudahAbsen) {
                Absence::create([
                    'participant_id' => $participant->id,
                    'date' => $today,
                    'status' => 'absent',
                    'activity' => 'Tidak mengisi absensi',
                ]);

                $this->info("Alfa: {$participant->user->name} pada {$today}");
            }
        }

        return Command::SUCCESS;
    }
}
