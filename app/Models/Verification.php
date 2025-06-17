<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Verification extends Model
{

    use HasFactory;
    protected $fillable = [
        'absence_id',
        'mentor_id',
        'status',
        'note',
    ];

    public function absence()
    {
        return $this->belongsTo(Absence::class);
    }

    public function mentor()
    {
        return $this->belongsTo(Mentor::class);
    }
    // Aksesor label status
    public function getStatusLabelAttribute()
    {
        return ucfirst($this->status);
    }
}
