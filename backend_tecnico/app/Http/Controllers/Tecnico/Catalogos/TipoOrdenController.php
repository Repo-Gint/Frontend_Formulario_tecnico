<?php

namespace App\Http\Controllers\Tecnico\Catalogos;

use App\Http\Controllers\Controller;
use App\Services\Tecnico\Catalogos\TipoOrdenService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TipoOrdenController extends Controller
{
    protected $tipoOrdenesService;

    public function __construct(
        TipoOrdenService $TipoOrdenService
    ) {
        $this->tipoOrdenesService = $TipoOrdenService;
    }

    public function obtenerListaTipoOrden()
    {
        try {
            return $this->tipoOrdenesService->obtenerListaTipoOrden();
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
