<?php

namespace App\Repositories\Tecnico\Catalogos;

use App\Models\CatFechas;

class FechasOrdenRepository
{
    public function registrarFechaOrden($fechas)
    {
        $registro = new CatFechas();

        $registro->id_day   = $fechas['id_day'];
        $registro->day_name = $fechas['day_name'];
        $registro->activo   = 1;
        $registro->save();

        return $registro->_id;
    }

    public function obtenerListaFechaOrden()
    {
        return CatFechas::all();
    }
}
