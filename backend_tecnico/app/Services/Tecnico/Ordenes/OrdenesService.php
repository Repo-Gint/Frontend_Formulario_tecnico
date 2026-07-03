<?php

namespace App\Services\Tecnico\Ordenes;

use App\Repositories\Tecnico\Catalogos\FechasOrdenRepository;
use App\Repositories\Tecnico\Catalogos\TipoOrdenRepository;
use App\Repositories\Tecnico\Ordenes\OrdenesRepository;

class OrdenesService
{
    protected $ordenesRepository;
    protected $fechasOrdenRepository;
    protected $tipoOrdenRepository;


    public function __construct(
        OrdenesRepository     $OrdenesRepository,
        FechasOrdenRepository $FechasOrdenRepository,
        TipoOrdenRepository   $TipoOrdenRepository
    ) {
        $this->ordenesRepository     = $OrdenesRepository;
        $this->fechasOrdenRepository = $FechasOrdenRepository;
        $this->tipoOrdenRepository   = $TipoOrdenRepository;
    }

    public function obtenerRecursosRegistroOrden() {
        $tipoOrdenes = $this->tipoOrdenRepository->obtenerListaTipoOrden();
        $fechas      = $this->fechasOrdenRepository->obtenerListaFechaOrden();

        return response()->json(
            [
                'mensaje'  => 'Se obtuvo los recursos correctamente',
                'recursos' => [
                    'listatipoOrden' => $tipoOrdenes,
                    'listafechas'    => $fechas,
                ]
            ]
        );
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

    public function obtenerDetalleOrden($idOrden)
    {
        $orden = $this->ordenesRepository->obtenerDetalleOrden($idOrden);

        if (!$orden) {
            return response()->json([
                'mensaje' => 'La orden no existe'
            ], 404);
        }

        return response()->json([
            'orden'   => $orden,
            'mensaje' => 'Se obtuvo el detalle de la orden'
        ]);
    }


    public function obtenerListaOrdenes()
    {
        $ordenes = $this->ordenesRepository->obtenerListaOrdenes();

        return response()->json(
            [
                'ordenes' => $ordenes,
                'mensaje' => 'Se obtuvo la información de ordenes'
            ]
        );
    }

    public function obtenerListaOrdenesUsuario()
    {
        $ordenesUsuario = $this->ordenesRepository->obtenerListaOrdenesUsuario();

        return response()->json(
            [
                'ordenesUsuario' => $ordenesUsuario,
                'mensaje' => 'Se obtuvo la lista de ordenes por usuario'
            ]
        );
    }
}
