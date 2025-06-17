<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Holiday extends Model
{
    use HasFactory;

    protected $fillable = ['date', 'description'];
    public static function isHoliday($date)
    {
        return self::whereDate('date', $date)->exists();
    }
}
