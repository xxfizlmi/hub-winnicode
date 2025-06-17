<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mentor extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'organization_name',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function participant()
    {
        return $this->hasMany(Participant::class); 
    }
    public function verifications()
    {
        return $this->hasMany(Verification::class);
    }
}
