<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\Room;
use App\Models\User;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    protected $model;
    protected $room;
    protected $message;


    public function __construct(
        User $user,
        Room $room,
        Message $message
    )
    {
        $this->model = $user;
        $this->room = $room;
        $this->message = $message;
    }

    public function listUsers()
    {
        $users = $this->model->where('id', '<>', auth()->user()->id)->get();
        return view('chat.list_user', compact('users'));
    }

    public function roomChatAll(Request $request)
    {
        $chatRoom = $this->room->find(1);
        if($request->ajax()) {
            return $this->getMessages($chatRoom->id) ;
        }

        return view('chat.chat_all', compact('chatRoom'));
    }

    public function showUserChat(Request $request, $id)
    {
        $user = $this->model->find($id);
        $chatRoom = $this->createRoom([$id, auth()->user()->id]);
        if($request->ajax()) {
            return $this->getMessages($chatRoom->id) ;
        }

        return view('chat.chat_user', compact('user', 'chatRoom'));
    }

    public function getMessages($roomId)
    {
        $message = $this->message->with('userFrom')->where('room_id', $roomId)->get();

        $message->map(function($item, int $key) {
            $item['name'] = $item->userFrom->name;
            $item['avatar'] = $item->userFrom->profile_photo_path;

            return $item;
        });

        return response()->json($message, 200);
    }

    public function createMessage(Request $request)
    {
        $attributes = $request->all();
        $this->message->fill($attributes);
        $this->message->create($attributes);

        return response()->json(200);
    }

    public function createRoom($users)
    {
        sort($users);
        $room = $users[0] . '_demo_' . $users[1];
        return Room::updateOrCreate(['name' => $room]);
    }
}
