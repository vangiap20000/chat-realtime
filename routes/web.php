<?php

use App\Http\Controllers\ChatController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::middleware([
    'auth:sanctum',
    config('jetstream.auth_session'),
    'verified'
])->group(function () {
    Route::controller(DashboardController::class)->group(function () {
        Route::get('/dashboard', 'index')->name('dashboard');
        Route::post('/orders', 'store');
    });

    Route::controller(ChatController::class)->group(function () {
        Route::get('/list-users', 'listUsers')->name('list_users');
        Route::group(['prefix' => 'chat', 'as' => 'chat_'], function () {
            Route::get('/all', 'roomChatAll')->name('all');
            Route::get('/user/{id}', 'showUserChat')->name('user');
            Route::post('/message-create', 'createMessage')->name('message_create');
        });
    });
});
