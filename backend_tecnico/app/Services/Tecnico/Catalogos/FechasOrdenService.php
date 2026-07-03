<?php

namespace App\Services\Tecnico\Catalogos;

use App\Repositories\Tecnico\Catalogos\FechasOrdenRepository;

class FechasOrdenService
{
    protected $fechasOrdenRepository;

    public function __construct(
        FechasOrdenRepository $FechasOrdenRepository
    ) {
        $this->fechasOrdenRepository = $FechasOrdenRepository;
    }

    public function registrarFechaOrden(array $fechas)
    {
        $this->fechasOrdenRepository->registrarFechaOrden($fechas);

        return response()->json(
            [
                'mensaje' => 'Se registro la fechaOrden con éxito',
                'title'   => 'Registro exitoso'
            ]
        );
    }

    public function obtenerListaFechaOrden() {
        $fechas = $this->fechasOrdenRepository->obtenerListaFechaOrden();

        return response()->json(
            [
                'fechas' => $fechas,
                'mensaje' => 'Se obtuvo la información de fechasOrden'
            ]
        );
    }
}
