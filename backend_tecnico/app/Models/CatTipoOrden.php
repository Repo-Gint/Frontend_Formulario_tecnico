<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class CatTipoOrden extends Model
{
    protected $connection = 'mongodb';
    protected $table      = 'cat_type_order';
    
    protected $fillable = [
        'id_type_order',
        'type_order',
        'active'
    ];
}
