<?php

        namespace App\Repositories\Tecnico\Catalogos;

use App\Models\CatTipoOrden;

        class TipoOrdenRepository
        {
            public function obtenerListaTipoOrden() {
                return CatTipoOrden::all();
            }
        }
    