<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ForeignWord extends Model
{
    protected $table = 'foreign_words';

    protected $primaryKey = 'word';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'word',
        'language',
        'syllables',
        'length',
        'first_letter',
        'last_letter',
    ];

    protected $casts = [
        'syllables' => 'integer',
        'length' => 'integer',
    ];
}
