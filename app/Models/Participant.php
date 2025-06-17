<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Participant extends Model
{
    protected $fillable = ['user_id', 'student_number', 'major', 'company_name'];
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function absences()
    {
        return $this->hasMany(Absence::class);
    }
    public function mentor()
    {
        return $this->belongsTo(Mentor::class, 'mentor_id');
    }
}
