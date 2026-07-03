<?php

namespace App\Http\Controllers\Tecnico\Ordenes;

use App\Http\Controllers\Controller;
use App\Services\Tecnico\Ordenes\OrdenesService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class OrdenesController extends Controller
{
    protected $ordenesService;

    public function __construct(
        OrdenesService $OrdenesService
    ) {
        $this->ordenesService = $OrdenesService;
    }

    public function obtenerRecursosRegistroOrden() {
        try {
            return $this->ordenesService->obtenerRecursosRegistroOrden();
        } catch (\Throwable $error) {
            Log::alert('*********************************************');
            Log::alert('Error al obtener información de Recursos registro tickets');
            Log::alert($error);

            return response()->json(
                [
                    'error'   => $error,
                    'mensaje' => 'Ocurrio un error interno'
                ],
                500
            );
        }
    }

    public function registrarOrden(Request $request) {
        try {
            $orden = $request->all();
            $files = $request->file('images');

            return $this->ordenesService->registrarOrden($orden, $files);
        } catch (\Throwable $error) {
            Log::alert('*********************************************');
            Log::alert('Error al registrar la Orden');
            Log::alert($error);

            return response()->json([
                'error' => $error,
                'mensaje' => 'Ocurrió un error interno'
            ], 400);
        }
    }

    public function obtenerDetalleOrden($idOrden) {
        try {
            return $this->ordenesService->obtenerDetalleOrden($idOrden);
        } catch (\Throwable $error) {
            Log::alert('*********************************************');
            Log::alert('Error al obtener información de orden');
            Log::alert($error);
            return response()->json(
                [
                    'error'   => $error,
                    'mensaje' => 'Ocurrió un error interno'
                ],
                500
            );
        }
    }

    public function obtenerListaOrdenes() {
        try {
            return $this->ordenesService->obtenerListaOrdenes();
        } catch (\Throwable $error) {
            Log::alert('*********************************************');
            Log::alert('Error al obtener información de orden');
            Log::alert($error);
            return response()->json(
                [
                    'error'   => $error,
                    'mensaje' => 'Ocurrió un error interno'
                ],
                500
            );
        }
    }

    public function obtenerListaOrdenesUsuario() {
        try {
            return $this->ordenesService->obtenerListaOrdenesUsuario();
        } catch (\Throwable $error) {
            Log::alert('*********************************************');
            Log::alert('Error al obtener información de orden por usuario');
            Log::alert($error);
            return response()->json(
                [
                    'error'   => $error,
                    'mensaje' => 'Ocurrió un error interno'
                ],
                500
            );
        }
    }
}
