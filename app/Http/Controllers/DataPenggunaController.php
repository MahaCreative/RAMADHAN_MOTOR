<?php

namespace App\Http\Controllers;

use App\Models\FotoPengguna;
use App\Models\Pengguna;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DataPenggunaController extends Controller
{
    public function createPengguna(Request $request)
    {
        // dd($request->all());



        $pengguna = Pengguna::create(['nama' => $request->nama]);

        $files = $request->foto; // Mengambil array file

        foreach ($files as $i => $file) {


            $filename = $request->nama . '/' . $request->nama . $i . '.' . 'jpeg';
            $fotoUrl = $file['file']->storeAs($filename);
            FotoPengguna::create(['pengguna_id' => $pengguna->id, 'foto' => $fotoUrl]);
        }
        return redirect()->back();
    }
    public function deletePengguna(Request $request)
    {
        $pengguna = Pengguna::findOrFail($request->id);
        $foto = FotoPengguna::where('pengguna_id', $pengguna->id)->get();
        if ($foto) {
            foreach ($foto as $item) {

                Storage::disk('public')->delete($item->foto);
                $folderPath = $pengguna->nama; // Sesuaikan dengan path folder tempat Anda menyimpan foto-foto
                if (Storage::disk('public')->exists($folderPath) && empty(Storage::disk('public')->allFiles($folderPath))) {
                    Storage::disk('public')->deleteDirectory($folderPath);
                }

                $item->delete();
            }
        }
        $pengguna->delete();
        return redirect()->back();
        // Tambahkan logika lain jika diperlukan
    }
    public function deleteFotoPengguna(Request $request)
    {
        $foto = FotoPengguna::findOrFail($request->id);
        $pengguna = Pengguna::findOrFail($foto->pengguna_id);
        Storage::disk('public')->delete($foto->foto);
        $folderPath = $pengguna->nama; // Sesuaikan dengan path folder tempat Anda menyimpan foto-foto
        if (Storage::disk('public')->exists($folderPath) && empty(Storage::disk('public')->allFiles($folderPath))) {
            Storage::disk('public')->deleteDirectory($folderPath);
            $pengguna->delete();
        }
        $foto->delete();
        return redirect()->back();
    }
}
