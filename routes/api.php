<?php

use App\Http\Controllers\Api\AuthApiController;
use App\Http\Controllers\Api\Admin\ParticipantApiController;
use App\Http\Controllers\Api\Admin\MentorApiController;
use App\Http\Controllers\Api\Admin\AssignmentApiController;
use App\Http\Controllers\Api\Admin\AbsenceApiController;
use App\Http\Controllers\Api\Mentor\MentorController;
use App\Http\Controllers\Api\Participant\ParticipantController;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthApiController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthApiController::class, 'logout']);
    Route::get('/profile', fn(Request $request) => $request->user());
});

Route::middleware(['auth:sanctum', 'is_admin'])->get('/admin-area', function () {
    return response()->json(['message' => 'Welcome Admin']);
});

Route::middleware(['auth:sanctum', 'is_admin'])->prefix('admin')->group(function () {
    Route::get('/participants', [ParticipantApiController::class, 'index']);
    Route::post('/participants', [ParticipantApiController::class, 'store']);
    Route::put('/participants/{id}', [ParticipantApiController::class, 'update']);
    Route::delete('/participants/{id}', [ParticipantApiController::class, 'destroy']);

    Route::get('/mentors', [MentorApiController::class, 'index']);
    Route::post('/mentors', [MentorApiController::class, 'store']);
    Route::put('/mentors/{id}', [MentorApiController::class, 'update']);
    Route::delete('/mentors/{id}', [MentorApiController::class, 'destroy']);

    Route::get('/assignments', [AssignmentApiController::class, 'index']);
    Route::put('/assignments/{id}', [AssignmentApiController::class, 'assign']);
    Route::get('/absences', [AbsenceApiController::class, 'index']);
    Route::put('/absences/verify/{id}', [AbsenceApiController::class, 'verify']);
});


Route::middleware(['auth:sanctum', 'is_mentor'])->prefix('mentor')->group(function () {
    Route::get('/dashboard', [MentorController::class, 'dashboard']);
    Route::get('/participants', [MentorController::class, 'participants']);
    Route::get('/verifications', [MentorController::class, 'verifications']);
    Route::put('/verifications/{id}', [MentorController::class, 'updateVerification']);
    Route::get('/report', [MentorController::class, 'report']);
});


Route::middleware(['auth:sanctum', 'is_participant'])->prefix('participant')->group(function () {
    Route::get('/dashboard', [ParticipantController::class, 'dashboard']);
    Route::get('/absences', [ParticipantController::class, 'absences']);
    Route::post('/absences', [ParticipantController::class, 'storeAbsence']);
    Route::post('/absences/checkout', [ParticipantController::class, 'checkOut']);
    Route::get('/report', [ParticipantController::class, 'report']);
    Route::get('/profile', [ParticipantController::class, 'profile']);
    Route::post('/profile', [ParticipantController::class, 'updateProfile']);
});
