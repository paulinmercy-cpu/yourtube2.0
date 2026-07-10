"use client";

import React from "react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  Circle,
  PhoneOff,
} from "lucide-react";

interface ControlBarProps {
  micOn: boolean;
  cameraOn: boolean;
  recording: boolean;

  toggleMic: () => void;
  toggleCamera: () => void;
  shareScreen: () => void;
  startRecording: () => void;
  stopRecording: () => void;
  endCall: () => void;
}

export default function ControlBar({
  micOn,
  cameraOn,
  recording,
  toggleMic,
  toggleCamera,
  shareScreen,
  startRecording,
  stopRecording,
  endCall,
}: ControlBarProps) {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50">

      <div className="bg-[#1f1f1f]/95 backdrop-blur-md rounded-full px-6 py-4 flex items-center gap-5 shadow-2xl border border-gray-700">

        {/* Mic */}
        <button
          onClick={toggleMic}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition ${
            micOn
              ? "bg-gray-700 hover:bg-gray-600"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {micOn ? <Mic size={24} /> : <MicOff size={24} />}
        </button>

        {/* Camera */}
        <button
          onClick={toggleCamera}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition ${
            cameraOn
              ? "bg-gray-700 hover:bg-gray-600"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {cameraOn ? <Video size={24} /> : <VideoOff size={24} />}
        </button>

        {/* Screen Share */}
        <button
          onClick={shareScreen}
          className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition"
        >
          <Monitor size={24} />
        </button>

        {/* Record */}
        <button
          onClick={() =>
            recording ? stopRecording() : startRecording()
          }
          className={`w-14 h-14 rounded-full flex items-center justify-center transition ${
            recording
              ? "bg-red-600 animate-pulse"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          <Circle size={22} />
        </button>

        {/* End Call */}
        <button
          onClick={endCall}
          className="w-16 h-16 rounded-full bg-red-700 hover:bg-red-800 flex items-center justify-center transition"
        >
          <PhoneOff size={28} />
        </button>

      </div>

    </div>
  );
}