<?php

use App\Http\Controllers\Auth\Usuarios\UsuariosController;
use Illuminate\Support\Facades\Route;

Route::get('/test', function () {
    return response()->json(['ok' => true]);
});

Route::get('/', function () {
    return view('welcome');
});