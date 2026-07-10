"use client";

import React from "react";
import { PhoneCall } from "lucide-react";

interface CallTimerProps {
  callConnected: boolean;
  seconds: number;
}

export default function CallTimer({
  callConnected,
  seconds,
}: CallTimerProps) {
  function formatTime() {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  }

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-black/70 backdrop-blur-md rounded-full px-6 py-3 flex items-center gap-3 shadow-xl border border-gray-700">
        <PhoneCall className="text-green-500" size={20} />

        <span className="text-white font-semibold text-lg">
          {callConnected ? formatTime() : "Not Connected"}
        </span>
      </div>
    </div>
  );
}