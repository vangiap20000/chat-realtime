<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Message extends Model
{
    use HasFactory;

    protected $table = 'messages';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'room_id', 'from', 'content', 'file', 'created_at', 'updated_at'
    ];

    /**
     * Get the room for the blog messages.
     */
    public function room(): HasOne
    {
        return $this->hasOne(Room::class);
    }

    /**
     * Get the userFrom that owns the messages.
     */
    public function userFrom(): BelongsTo
    {
        return $this->belongsTo(User::class, 'from', 'id');
    }
}
