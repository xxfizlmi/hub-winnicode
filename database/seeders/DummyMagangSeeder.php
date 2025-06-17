<?php

namespace Database\Seeders;

use App\Models\Mentor;
use App\Models\Participant;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DummyMagangSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    
    {
       User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin Utama',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ]
        );

        // === Pembimbing ===
        $mentorUser = User::firstOrCreate(
            ['email' => 'siti@mentor.com'],
            [
                'name' => 'Siti Pembimbing',
                'password' => Hash::make('password'),
                'role' => 'mentor',
            ]
        );

        $mentor = Mentor::firstOrCreate(
            ['user_id' => $mentorUser->id],
            ['organization_name' => 'Universitas ABC']
        );

        // === Mahasiswa 1 ===
        $mahasiswaUser1 = User::firstOrCreate(
            ['email' => 'budi@student.com'],
            [
                'name' => 'Budi Mahasiswa',
                'password' => Hash::make('password'),
                'role' => 'participant',
            ]
        );

        Participant::firstOrCreate(
            ['user_id' => $mahasiswaUser1->id],
            [
                'student_number' => '12345678',
                'major' => 'Teknik Informatika',
                'company_name' => 'PT Winnicode Garuda Teknologi',
                'mentor_id' => $mentor->id, 
            ]
        );

        // === Mahasiswa 2 ===
        $mahasiswaUser2 = User::firstOrCreate(
            ['email' => 'mahasiswa@mail.com'],
            [
                'name' => 'Mahasiswa Dummy',
                'password' => Hash::make('password'),
                'role' => 'participant',
            ]
        );

        Participant::firstOrCreate(
            ['user_id' => $mahasiswaUser2->id],
            [
                'student_number' => '215150700111001',
                'major' => 'Teknik Informatika',
                'company_name' => 'PT Winnicode',
                'mentor_id' => $mentor->id, 
            ]
        );
    }
}
