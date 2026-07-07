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

        // Datos generales
        $registro->id_type_order   = $orden['id_order_type'];
        $registro->module          = $orden['module'];
        $registro->enginner        = $orden['enginner'];
        $registro->place           = $orden['place'];
        // Objetos
        $registro->customer        = json_decode($orden['customer'], true);
        $registro->equipment       = json_decode($orden['equipment'], true);
        $registro->work_hours      = json_decode($orden['work_hours'], true);
        // Información adicional
        $registro->final_goal      = $orden['final_goal'];
        $registro->signature       = $orden['signature'] ?? null;
        // Estado
        $registro->id_status_order = $orden['id_status_order'] ?? 1;
        // Auditoría
        $registro->started_by      = $orden['started_by'] ?? null;
        $registro->start_date      = $orden['start_date'] ?? null;
        $registro->cancelled_by    = $orden['cancelled_by'] ?? null;
        $registro->cancelled_at    = $orden['cancelled_at'] ?? null;
        $registro->finished_by     = $orden['finished_by'] ?? null;
        $registro->finished_at     = $orden['finished_at'] ?? null;
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

    public function actualizarOrden($idOrden, $orden)
{
    $registro = TblOrdenes::find($idOrden);
    if (!$registro) {
        throw new \Exception('La orden no existe');
    }
    $registro->id_type_order = $orden['id_type_order'];
    $registro->module = $orden['module'];
    $registro->enginner = $orden['enginner'];
    $registro->place = $orden['place'];
    $registro->customer = json_decode($orden['customer'], true);
    $registro->equipment = json_decode($orden['equipment'], true);
    $registro->work_hours = json_decode($orden['work_hours'], true);
    $registro->final_goal = $orden['final_goal'];
    $registro->signature = $orden['signature'] ?? null;
    $registro->id_status_order = $orden['id_status_order'];
    $registro->save();
    return $registro;
}
}
