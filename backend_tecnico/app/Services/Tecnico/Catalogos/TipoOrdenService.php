<?php

namespace App\Services\Tecnico\Catalogos;

use App\Repositories\Tecnico\Catalogos\TipoOrdenRepository;

class TipoOrdenService
{
    protected $tipoOrden;

    public function __construct(
        TipoOrdenRepository $TipoOrdenRepository
    ) {
        $this->tipoOrden = $TipoOrdenRepository; 
    }

    public function obtenerListaTipoOrden() {
        $tipoOrdenes = $this->tipoOrden->obtenerListaTipoOrden();

        return response()->json(
            [
                'tipoOrdenes' => $tipoOrdenes,
                'mensaje'     => 'Se obtuvo la información de tipoOrdenes'
            ]
        );
    }
}
