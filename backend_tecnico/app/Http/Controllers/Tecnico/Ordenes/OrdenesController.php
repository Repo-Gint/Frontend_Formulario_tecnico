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
}
