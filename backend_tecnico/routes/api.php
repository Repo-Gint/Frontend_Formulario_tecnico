<?php

use App\Http\Controllers\Auth\usuarios\UsuariosController;
use App\Http\Controllers\Tecnico\Ordenes\OrdenesController;
use Illuminate\Support\Facades\Route;

Route::post('/usuarios/login', [UsuariosController::class, 'login']);


//Usuarios
Route::post('/usuarios/login',                                                        [UsuariosController::class, 'login']);

Route::post('/usuarios/registrarUsuario',                                             [UsuariosController::class, 'registrarUsuario']);
Route::post('/usuarios/cerrarSesion',                                                 [UsuariosController::class, 'cerrarSesion']);
Route::get('/usuarios/obtenerListaGeneralUsuarios',                                   [UsuariosController::class, 'obtenerListaGeneralUsuarios']);
Route::get('/usuarios/obtenerDetalleUsuario/{pkUsuario}',                             [UsuariosController::class, 'obtenerDetalleUsuario']);
Route::get('/usuarios/obtenerRecursosRegistroUsuario',                                [UsuariosController::class, 'obtenerRecursosRegistroUsuario']);
Route::put('/usuarios/actualizarUsuario',                                             [UsuariosController::class, 'actualizarUsuario']);
Route::get('/usuarios/cambiarStatusUsuario/{id}',                                     [UsuariosController::class, 'cambiarStatusUsuario']);

//Ordenes
Route::post('/ordenes/registrarOrden',                                                 [OrdenesController::class,  'registrarOrden']);


//Clientes

