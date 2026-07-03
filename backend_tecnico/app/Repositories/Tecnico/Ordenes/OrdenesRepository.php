<?php

namespace App\Repositories\Tecnico\Ordenes;

use App\Models\TblOrdenes;
use MongoDB\Laravel\Eloquent\Casts\ObjectId;

class OrdenesRepository
{
    public function registrarOrden(array $orden, ?array $files = null)
    {
        $registro = new TblOrdenes();

        $registro->user_id = request()->id_usuario_auth;

        $registro->id_type_order      = $orden['id_type_order'];
        $registro->module             = $orden['module'];
        $registro->place              = $orden['place'];
        $registro->customer           = $orden['customer'];
        $registro->equipment          = $orden['equipment'];
        $registro->work_hours         = $orden['work_hours'];
        $registro->final_goal         = $orden['final_goal'];
        $registro->signature          = $orden['signature'] ?? null;
        $registro->id_status_order    = 1;
        $registro->started_by         = null;
        $registro->start_date         = null;
        $registro->cancelled_by       = null;
        $registro->cancelled_at       = null;
        $registro->finished_by        = null;
        $registro->finished_at        = null;

        $registro->save();

        return $registro;
    }

    public function obtenerDetalleOrden(string $idOrden)
    {
        return TblOrdenes::where('_id', $idOrden)
            ->where('user_id', request()->id_usuario_auth)
            ->first();
    }

    // Se usara solamente para el administrador

    public function obtenerListaOrdenes()
    {
        return TblOrdenes::all();
    }

    // Se usa para obtencion de ordenes por usuario
    public function obtenerListaOrdenesUsuario()
    {
        return TblOrdenes::where(
            'user_id',
            request()->id_usuario_auth
        )
            ->orderBy('created_at', 'desc')
            ->get();
    }
}
