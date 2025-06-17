<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('absences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('participant_id')->constrained()->onDelete('cascade');
            $table->date('date'); // tanggal
            $table->time('check_in')->nullable(); // jam_masuk
            $table->time('check_out')->nullable(); // jam_keluar
            $table->text('activity')->nullable(); // aktivitas
            $table->enum('status', ['present', 'excused', 'sick', 'absent','late'])->default('absent'); // status
            $table->string('evidence_file')->nullable(); // file_bukti
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('absences');
    }
};
