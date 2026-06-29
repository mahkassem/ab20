<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderLine extends Model
{
    public $timestamps = false;

    protected $fillable = ['order_id', 'product_id', 'quantity', 'unit_price', 'line_total'];
}
