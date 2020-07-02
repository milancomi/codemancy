<?php

namespace App\Http\Controllers;

use App\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        return view('home');
    }

    public function getAllPosts(){

        return Post::all();

}

    public function addPost(Request $request){

        Post::create([
            'title' => $request->title,
            'content' => $request->content,
            'user_id'=> Auth::user()->id,
          ]);

          $postData =  Post::all();
          return response()->json(["postData"=>$postData]);

    }
}
