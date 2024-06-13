<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Pengguna;
use App\Http\Controllers\DataPenggunaController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::get('get-pengguna', function(){
    $pengguna = Pengguna::with('foto')->latest()->get();
    return response()->json($pengguna);
});

Route::post('create-pengguna', [DataPenggunaController::class, 'createPengguna'])->name('create-pengguna');
Route::delete('delete-pengguna', [DataPenggunaController::class, 'deletePengguna'])->name('delete-pengguna');