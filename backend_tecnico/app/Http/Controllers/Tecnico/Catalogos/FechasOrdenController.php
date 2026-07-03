<?php

namespace App\Http\Controllers\Tecnico\Catalogos;

use App\Http\Controllers\Controller;
use App\Services\Tecnico\Catalogos\FechasOrdenService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class FechasOrdenController extends Controller
{
    protected $fechasOrdenService;

    public function __construct(
        FechasOrdenService $FechasOrdenService
    ) {
        $this->fechasOrdenService = $FechasOrdenService;   
    }

    public function registrarFechaOrden(Request $request) {
        try {
            return $this->fechasOrdenService->registrarFechaOrden($request->all());
        } catch (\Throwable $error) {
            Log::alert('*********************************************');
            Log::alert('Error al registrar la fechaOrden');
            Log::alert($error);

            return response()->json(
                [
                    'error' => $error,
                    'mensaje' => 'Ocurrió un error interno'
                ],
                500
            );
        }
    }

    public function obtenerListaFechaOrden()
    {
        try {
            return $this->fechasOrdenService->obtenerListaFechaOrden();
        } catch (\Throwable $error) {
            Log::alert('*********************************************');
            Log::alert('Error al obtener información de FechaOrden');
            Log::alert($error);
            return response()->json(
                [
                    'error' => $error,
                    'mensaje' => 'Ocurrió un error interno'
                ],
                500
            );
        }
    }
}
