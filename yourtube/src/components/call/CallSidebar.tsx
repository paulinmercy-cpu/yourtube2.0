"use client";

import React from "react";
import { Phone } from "lucide-react";

interface Props {
  myId: string;
  friendId: string;
  setFriendId: React.Dispatch<React.SetStateAction<string>>;
  onlineUsers: Record<string, string>;
  callFriend: () => void;
  answerCall: () => void;
}

export default function CallSidebar({
  myId,
  friendId,
  setFriendId,
  onlineUsers,
  callFriend,
  answerCall,
}: Props) {
  return (
    <aside className="w-[320px] min-w-[320px] h-screen bg-white border-r border-gray-300 p-6 overflow-y-auto">

      {/* Heading */}
      <h2 className="text-3xl font-bold text-black mb-8">
        Connect with your friends
      </h2>

      {/* Your ID */}
      <div className="mb-6">
        <label className="block text-black font-semibold mb-2">
          Your ID
        </label>

        <input
          type="text"
          value={myId}
          readOnly
          className="w-full rounded-lg border border-gray-400 bg-white px-4 py-3 text-black outline-none focus:border-blue-500"
        />
      </div>

      {/* Friend ID */}
      <div className="mb-6">
        <label className="block text-black font-semibold mb-2">
          Friend ID
        </label>

        <input
          type="text"
          value={friendId}
          onChange={(e) => setFriendId(e.target.value)}
          placeholder="Paste Friend ID"
          className="w-full rounded-lg border border-gray-400 bg-white px-4 py-3 text-black placeholder-gray-500 outline-none focus:border-blue-500"
        />
      </div>

      {/* Call Button */}
      <button
        onClick={callFriend}
        className="w-full bg-red-600 hover:bg-red-700 text-white rounded-lg py-3 font-semibold flex items-center justify-center gap-2 transition"
      >
        <Phone size={18} />
        Call Friend
      </button>

      {/* Answer Button */}
      <button
        onClick={answerCall}
        className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white rounded-lg py-3 font-semibold transition"
      >
        Answer Call
      </button>

      {/* Online Users */}
      <div className="mt-10">
        <h3 className="text-xl font-bold text-black mb-4">
          Online Users
        </h3>

        {Object.keys(onlineUsers).length === 0 ? (
          <p className="text-gray-600">No users online</p>
        ) : (
          Object.keys(onlineUsers).map((id) => (
            <div
              key={id}
              onClick={() => setFriendId(id)}
              className="cursor-pointer bg-gray-100 hover:bg-gray-200 border rounded-lg p-3 mb-2 text-black break-all transition"
            >
              {id}
            </div>
          ))
        )}
      </div>
    </aside>
  );
}