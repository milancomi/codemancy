<?php

use App\Events\PostEvent;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');

Route::get('/fire', function () {
    broadcast(new PostEvent());
});


Route::get('/getPosts', 'HomeController@getAllPosts')->name('home');

Route::post('/new_post', 'HomeController@addPost')->name('home');

Route::post('/new_comment', 'HomeController@addComment')->name('home');

