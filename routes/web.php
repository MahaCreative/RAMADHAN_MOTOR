<?php

use App\Http\Controllers\DataPenggunaController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('p', [HomeController::class, 'index'])->name('index');
Route::get('/', function () {
    return inertia('welcom');
});
Route::post('create-pengguna', [DataPenggunaController::class, 'createPengguna'])->name('create-pengguna');
Route::delete('delete-pengguna', [DataPenggunaController::class, 'deletePengguna'])->name('delete-pengguna');
Route::delete('delete-foto-pengguna', [DataPenggunaController::class, 'deleteFotoPengguna'])->name('delete-foto-pengguna');
