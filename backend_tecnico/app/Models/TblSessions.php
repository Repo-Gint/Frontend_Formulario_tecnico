<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class TblSessions extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'tbl_sessions';

    protected $fillable = [
        'id_sessions',
        'id_users',
        'token'
    ];
}
