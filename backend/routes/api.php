<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});

Route::middleware(['auth:sanctum', 'tenant'])->group(function () {
    Route::get('/users', [UserController::class, 'index']);

    Route::get('/tasks/stats', [TaskController::class, 'stats']);

    Route::apiResource('tasks', TaskController::class);
});