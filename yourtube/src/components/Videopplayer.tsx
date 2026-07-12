"use client";

import React, { useEffect, useRef, useState } from "react";
import { useVideoGestures } from "@/hooks/useVideoGestures";

interface VideoProps {
  video: any;
  videoId: string;
  onNextVideo?: () => void;
}

const Videoplayer = ({ video, videoId, onNextVideo }: VideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const viewCounted = useRef(false);

  const [overlay, setOverlay] = useState<
    "play" | "forward" | "rewind" | null
  >(null);

  // ✅ FIX 1: safer videoSrc
  const videoSrc =
    video?.filename && process.env.NEXT_PUBLIC_API_URL
      ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${video.filename}`
      : null;

  // ✅ FIX 2: safe user parsing
  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : {};

  const plan = user?.plan || "Free";

  const limits: Record<string, number> = {
    Free: 300,
    Bronze: 420,
    Silver: 600,
    Gold: Infinity,
  };

  const maxTime = limits[plan] ?? 300;

  // ---------------- WATCH LIMIT ----------------
  useEffect(() => {
    const player = videoRef.current;
    if (!player) return;

    const checkTime = () => {
      if (maxTime !== Infinity && player.currentTime >= maxTime) {
        player.pause();
        alert(
          `Your ${plan} plan allows only ${maxTime / 60} minutes of watching.`
        );
        player.currentTime = maxTime;
      }
    };

    player.addEventListener("timeupdate", checkTime);
    return () => player.removeEventListener("timeupdate", checkTime);
  }, [plan, maxTime]);

  // ---------------- VIEW COUNT ----------------
  useEffect(() => {
    const player = videoRef.current;
    if (!player) return;

    const handleView = async () => {
      if (!viewCounted.current && player.currentTime >= 5) {
        viewCounted.current = true;

        try {
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/video/${videoId}/view`,
            { method: "PUT" }
          );
          console.log("View counted");
        } catch (err) {
          console.error(err);
        }
      }
    };

    player.addEventListener("timeupdate", handleView);
    return () => player.removeEventListener("timeupdate", handleView);
  }, [videoId]);

  // ---------------- HISTORY ----------------
  useEffect(() => {
    const player = videoRef.current;
    if (!player || !video?._id) return;

    const user =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("user") || "{}")
        : null;

    if (!user?._id) return;

    let saved = false;

    const saveHistory = async () => {
      if (saved || player.currentTime < 5) return;

      saved = true;

      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/history`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user._id,
            videoId: video._id,
          }),
        });

        console.log("History Saved");
      } catch (err) {
        console.error("History Error:", err);
      }
    };

    player.addEventListener("timeupdate", saveHistory);
    return () => player.removeEventListener("timeupdate", saveHistory);
  }, [video]);

  // ---------------- OVERLAY ----------------
  const showOverlay = (type: "play" | "forward" | "rewind") => {
    setOverlay(type);
    setTimeout(() => setOverlay(null), 700);
  };

  // ---------------- GESTURES ----------------
  const containerRef = useVideoGestures({
    videoRef,
    onPlayPause: () => {
      showOverlay("play");
      navigator.vibrate?.(40);
    },
    onForward: () => {
      showOverlay("forward");
      navigator.vibrate?.([40, 50, 40]);
    },
    onBackward: () => {
      showOverlay("rewind");
      navigator.vibrate?.([40, 50, 40]);
    },
    onNextVideo: () => onNextVideo?.(),
    onOpenComments: () => {
      document.getElementById("comments")?.scrollIntoView({
        behavior: "smooth",
      });
    },
    onCloseWebsite: () => window.close(),
  });

  // ---------------- DEBUG ----------------
  console.log("VIDEO OBJECT:", video);
  console.log("VIDEO SRC:", videoSrc);

  // ✅ FIX 3: single return check
  if (!videoSrc) {
    return (
      <div className="aspect-video bg-black text-white flex items-center justify-center">
        No video found
      </div>
    );
  }

  // ---------------- UI ----------------
  return (
    <div
      ref={containerRef}
      className="aspect-video bg-black rounded-lg overflow-hidden relative"
    >
      <video
        ref={videoRef}
        className="w-full h-full"
        controls
        preload="metadata"
      >
        <source
          src={videoSrc}
          type={video?.filetype || "video/mp4"}
        />
        Your browser does not support the video tag.
      </video>

      {overlay && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-white text-6xl animate-pulse">
            {overlay === "play" && "▶"}
            {overlay === "forward" && "⏩"}
            {overlay === "rewind" && "⏪"}
          </div>
        </div>
      )}
    </div>
  );
};

export default Videoplayer;