<?php

use App\Http\Controllers\Auth\usuarios\UsuariosController;
use App\Http\Controllers\Tecnico\Catalogos\FechasOrdenController;
use App\Http\Controllers\Tecnico\Catalogos\TipoOrdenController;
use App\Http\Controllers\Tecnico\Ordenes\OrdenesController;
use Illuminate\Support\Facades\Route;

Route::post('/usuarios/login', [UsuariosController::class, 'login']);


Route::middleware(['auth.token'])->group(function () {

    // Usuarios
    Route::post('/usuarios/registrarUsuario', [UsuariosController::class, 'registrarUsuario']);
    Route::post('/usuarios/cerrarSesion', [UsuariosController::class, 'cerrarSesion']);
    Route::get('/usuarios/obtenerListaGeneralUsuarios', [UsuariosController::class, 'obtenerListaGeneralUsuarios']);
    Route::get('/usuarios/obtenerDetalleUsuario/{pkUsuario}', [UsuariosController::class, 'obtenerDetalleUsuario']);
    Route::get('/usuarios/obtenerRecursosRegistroUsuario', [UsuariosController::class, 'obtenerRecursosRegistroUsuario']);
    Route::put('/usuarios/actualizarUsuario', [UsuariosController::class, 'actualizarUsuario']);
    Route::get('/usuarios/cambiarStatusUsuario/{id}', [UsuariosController::class, 'cambiarStatusUsuario']);
    
    // Órdenes
    Route::post('/ordenes/registrarOrden',               [OrdenesController::class,    'registrarOrden']);
    Route::get('/ordenes/obtenerListaOrdenes',           [OrdenesController::class,    'obtenerListaOrdenes']);
    Route::get('/ordenes/obtenerListaOrdenesUsuario',    [OrdenesController::class,    'obtenerListaOrdenesUsuario']);
    Route::get('/ordenes/obtenerDetalleOrden/{idOrden}', [OrdenesController::class,    'obtenerDetalleOrden']);
    Route::get('/ordenes/obtenerRecursosRegistroOrden',  [OrdenesController::class,    'obtenerRecursosRegistroOrden']);
    Route::post('/ordenes/actualizarOrden',              [OrdenesController::class,    'actualizarOrden']);
    
    //FechasOrden
    Route::get('/fechasOrden/obtenerListaFechaOrden',    [FechasOrdenController::class, 'obtenerListaFechaOrden']);

    //Tipo Orden
    Route::get('/tipoOrden/obtenerListaTipoOrden',       [TipoOrdenController::class,   'obtenerListaTipoOrden']);

});

//Clientes

