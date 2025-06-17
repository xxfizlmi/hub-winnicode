<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Absence extends Model
{
    use HasFactory;
    protected $fillable = [
        'participant_id',
        'date',
        'check_in',
        'check_out',
        'activity',
        'evidence_file',
        'status'
    ];
    public function participant()
    {
        return $this->belongsTo(Participant::class);
    }

    public function verification()
    {
        return $this->hasOne(Verification::class);
    }
    public function getCheckInFormattedAttribute()
    {
        return \Carbon\Carbon::parse($this->check_in)->format('H:i');
    }

    public function getCheckOutFormattedAttribute()
    {
        return \Carbon\Carbon::parse($this->check_out)->format('H:i');
    }
}
