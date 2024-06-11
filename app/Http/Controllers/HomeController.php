<?php

namespace App\Http\Controllers;

use App\Models\Pengguna;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        $pengguna = Pengguna::with('foto')->latest()->get();
        return inertia('Index', compact('pengguna'));
    }
}
