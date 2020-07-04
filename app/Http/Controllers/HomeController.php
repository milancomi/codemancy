<?php

namespace App\Http\Controllers;

use App\Comment;
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

        $posts = Post::with('user','comments')->orderBy('created_at','desc')->get();

        return response()->json($posts);

}

    public function addPost(Request $request){

        Post::create([
            'title' => $request->title,
            'content' => $request->content,
            'user_id'=> Auth::user()->id,
          ]);

          $postData = Post::with('user','comments')->orderBy('created_at','desc')->get();
          return response()->json(["postData"=>$postData]);

    }





    public function addComment(Request $request)
    {
        $user_id = Auth::user()->id;
        $post_id = $request->post_id;
        $comment_text = $request->comment_text;


        $new_comment = Comment::create([
            'comment_text'=>$comment_text,
            'post_id'=>$post_id,
            'user_id'=>$user_id
        ]);

        $posts =  Post::with('user','comments')->orderBy('created_at','desc')->get();
        return response()->json($posts);




    }
}
