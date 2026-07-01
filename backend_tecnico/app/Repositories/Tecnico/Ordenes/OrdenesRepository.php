<?php

namespace App\Repositories\Tecnico\Ordenes;

use App\Models\TblOrdenes;

class OrdenesRepository
{
    public function registrarOrden(array $orden, ?array $files = null)
    {
        $registro = new TblOrdenes();

        $registro->user_id = request()->id_usuario_auth;

        $registro->order_type   = $orden['order_type'];
        $registro->module       = $orden['module'];
        $registro->place        = $orden['place'];
        $registro->customer     = $orden['customer'];
        $registro->equipment    = $orden['equipment'];
        $registro->work_hours   = $orden['work_hours'];
        $registro->final_goal   = $orden['final_goal'];
        $registro->signature    = $orden['signature'] ?? null;
        $registro->status       = $orden['status'] ?? 'Pendiente';

        $registro->started_by   = null;
        $registro->start_date   = null;
        $registro->cancelled_by = null;
        $registro->cancelled_at = null;
        $registro->finished_by  = null;
        $registro->finished_at  = null;

        $registro->save();

        return $registro;
    }
}
