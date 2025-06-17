<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class HolidaySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('holidays')->insert([
            ['date' => '2025-01-01', 'description' => 'Tahun Baru Masehi'],
            ['date' => '2025-08-17', 'description' => 'Hari Kemerdekaan'],
            ['date' => '2025-12-25', 'description' => 'Hari Natal'],
        ]);
    }
}
