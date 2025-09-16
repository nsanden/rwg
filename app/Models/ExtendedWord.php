<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExtendedWord extends Model
{
    protected $table = 'extended_words';

    protected $primaryKey = 'word';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'word',
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
