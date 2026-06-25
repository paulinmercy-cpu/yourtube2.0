"use client";

import React, { useRef } from "react";

interface VideoProps {
  video: any;
}

const Videoplayer = ({ video }: VideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // ✅ Build correct video URL from backend
  const videoSrc = video?.filename
    ? `http://localhost:5000/uploads/${video.filename}`
    : null;

  if (!videoSrc) {
    return (
      <div className="aspect-video bg-black flex items-center justify-center text-white">
        No video found
      </div>
    );
  }

  return (
    <div className="aspect-video bg-black rounded-lg overflow-hidden">
      <video
      ref={videoRef}
      className="w-full h-full"
      controls
      preload="metadata"
      >
        <source
          src={videoSrc}
          type={video.filetype || "video/mp4"}
        />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default Videoplayer;