<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Room extends Model
{
    use HasFactory;

    protected $table = 'rooms';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name', 'status', 'created_at', 'updated_at'
    ];

    /**
     * Get the message that owns the rooms.
     */
    public function message(): BelongsTo
    {
        return $this->belongsTo(Message::class);
    }
}
