"use client";

import React, { RefObject } from "react";
import { PhoneCall } from "lucide-react";

interface VideoAreaProps {
  localVideo: RefObject<HTMLVideoElement | null>;
  remoteVideo: RefObject<HTMLVideoElement | null>;
  callConnected: boolean;
}

export default function VideoArea({
  localVideo,
  remoteVideo,
  callConnected,
}: VideoAreaProps) {
  return (
    <div className="relative w-full h-full bg-[#101010] overflow-hidden">

      {/* Remote Video */}
      <video
        ref={remoteVideo}
        autoPlay
        playsInline
        className="w-full h-full object-cover bg-black"
      />

      {/* Waiting Screen */}
      {!callConnected && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">

          <div className="w-28 h-28 rounded-full bg-[#202020] flex items-center justify-center mb-6">
            <PhoneCall size={50} className="text-white" />
          </div>

          <h1 className="text-4xl font-bold text-white">
            Waiting for Call...
          </h1>

          <p className="mt-4 text-lg text-gray-400">
            Enter your friend's ID and press
            <span className="text-red-500 font-semibold">
              {" "}Call Friend
            </span>
          </p>

        </div>
      )}

      {/* Local Video */}
      <div className="absolute bottom-8 right-8 w-80 h-52 rounded-2xl overflow-hidden border-4 border-white shadow-2xl bg-black">

        <video
          ref={localVideo}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
        />

      </div>

    </div>
  );
}