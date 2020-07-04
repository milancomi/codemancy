<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $fillable = [
        'title', 'content', 'user_id','user_name'
    ];


    protected $casts = [
        'created_at' => 'datetime:h:m:s m/d ',
    ];

    public function comments()
    {
        return $this->hasMany('App\Comment');
    }

    public function user()
    {
      return $this->belongsTo('App\User');
    }}
