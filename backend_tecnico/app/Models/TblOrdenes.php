<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class TblOrdenes extends Model
{
    protected $connection = 'mongodb';
    protected $table      = 'tbl_orders';

    protected $fillable = [

        // Usuario que crea la orden
        'user_id',

        // Información general
        'id_type_order',
        'module',
        'place',
        'status',

        // CLIENTE (EMBEBIDO)
        'customer',

        // EQUIPO (EMBEBIDO)
        'equipment',

        // TRABAJOS / TIEMPOS (ARRAY)
        'work_hours',

        // OBJETIVO
        'final_goal',

        // FIRMA
        'signature',

        // CONTROL DE TRABAJO
        'started_by',
        'start_date',

        'cancelled_by',
        'cancelled_at',

        'finished_by',
        'finished_at',

        // timestamps
        'created_at',
        'updated_at'
    ];
}