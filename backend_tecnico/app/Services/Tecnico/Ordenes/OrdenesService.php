<?php

namespace App\Services\Tecnico\Ordenes;

use App\Repositories\Tecnico\Ordenes\OrdenesRepository;

class OrdenesService
{
    protected $ordenesRepository;

    public function __construct(
        OrdenesRepository $OrdenesRepository
    ) {
        $this->ordenesRepository = $OrdenesRepository;
    }

    public function registrarOrden(array $orden, $files)
    {

        $this->ordenesRepository->registrarOrden($orden, $files);

        return response()->json(
            [
                'mensaje' => 'Se registro la orden con éxito',
                'title'   => 'Registro exitoso'
            ]
        );
    }
}
