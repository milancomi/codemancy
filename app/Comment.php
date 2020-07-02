<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $fillable = [
        'comment_text', 'user_id', 'post_id',
    ];

    public function user()
    {
        return $this->belongsTo('App\User');
        // return $this->belongsTo('App\User', 'foreign_key');

    }

    public function post()
    {
        return $this->belongsTo('App\Post');
    }

}
