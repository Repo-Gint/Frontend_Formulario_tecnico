<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class TblClientes extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'tbl_customers';

    protected $fillable = [
        'id_customers', 
        'no_customers',
        'name',
        'position',
        'email',
        'address'
    ];
}
