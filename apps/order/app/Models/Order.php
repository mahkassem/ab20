<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    const UPDATED_AT = null;

    protected $fillable = ['user_id', 'status', 'notes', 'total_amount'];
}
