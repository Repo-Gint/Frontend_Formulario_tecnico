<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class CatFechas extends Model
{
    protected $connection = 'mongodb';
    protected $table      = 'cat_dates';

    protected $fillable = [
        'id_day',
        'day_name',
        'active'
    ];
}
