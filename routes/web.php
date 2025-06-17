<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ParticipantController;
use App\Http\Controllers\CompanyMentorController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\AuthApiController;

// Route::get('/', function () {
//     return view('welcome');
// });
// Route::post('/api/login', [AuthApiController::class, 'login'])->name('login');
Route::get('/login', [AuthController::class, 'index'])->name('login');
Route::post('/login', [AuthController::class, 'authenticate'])->name('login');
Route::get('/logout', [AuthController::class, 'logout'])->name('logout');

Route::middleware(['auth', 'is_admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'index'])->name('dashboard');
    Route::get('/weekly-summary', [AdminController::class, 'getWeeklySummary']);

    Route::get('/peserta', [AdminController::class, 'participant'])->name('participant');
    Route::post('/peserta', [AdminController::class, 'storeParticipant'])->name('participant');
    Route::put('/peserta/{id}', [AdminController::class, 'updateParticipant'])->name('updatAparticipant');
    Route::delete('/peserta/{id}', [AdminController::class, 'deleteParticipant'])->name('deleteAparticipant');

    Route::get('/mentor', [AdminController::class, 'mentor'])->name('mentor');
    Route::post('/mentor', [AdminController::class, 'storeMentor'])->name('createMentor');
    Route::put('/mentor/{id}', [AdminController::class, 'updateMentor'])->name('updatMentor');
    Route::delete('/mentor/{id}', [AdminController::class, 'deleteMentor'])->name('deleteMentor');

    Route::get('/penugasan', [AdminController::class, 'assignment'])->name('assignment');
    Route::post('/penugasan/{id}', [AdminController::class, 'storeAssignment'])->name('updateAssignment');

    Route::get('/absensi', [AdminController::class, 'absence'])->name('absence');
    Route::put('/absensi/verify/{id}', [AdminController::class, 'verifyAbsence'])->name('verifyAbsensi');

    Route::get('/laporan-admin', [AdminController::class, 'reportAdmin'])->name('report');
    Route::get('/laporan/{id}/detail-ajax', [AdminController::class, 'detailAjax'])->name('detailReport');
});


Route::middleware(['auth', 'is_mentor'])->prefix('mentor')->name('mentor.')->group(function () {
    Route::get('/', [CompanyMentorController::class, 'index'])->name('dashboard');

    Route::get('/verifikasi', [CompanyMentorController::class, 'verifyMentor'])->name('verify');
    Route::post('/verifikasi/{id}', [CompanyMentorController::class, 'updateVerification']);

    Route::get('/riwayat', [CompanyMentorController::class, 'history'])->name('history');
    Route::get('/peserta', [CompanyMentorController::class, 'participants'])->name('participant');

    Route::get('/laporan', [CompanyMentorController::class, 'reportMentor'])->name('report');
    Route::get('/laporan/{id}/detail-ajax', [CompanyMentorController::class, 'reportDetailAjax']);
});

Route::middleware(['auth', 'is_participant'])->prefix('peserta')->name('participant.')->group(function () {
    Route::get('/', [ParticipantController::class, 'index'])->name('dashboard');

    Route::get('/absensi', [ParticipantController::class, 'absenceParticipant'])->name('absence');
    Route::post('/absensi', [ParticipantController::class, 'storeParticipant'])->name('storeParticipant');
    Route::post('/absen-keluar', [ParticipantController::class, 'checkOut'])->name('participant.checkOut');

    Route::get('/laporan', [ParticipantController::class, 'reportParticipant'])->name('reportParticipant');

    Route::get('/profile', [ParticipantController::class, 'profileParticipant'])->name('profileParticipant');
    Route::post('/profile/update', [ParticipantController::class, 'updateProfileParticipant'])->name('updateProfileParticipant');
});
