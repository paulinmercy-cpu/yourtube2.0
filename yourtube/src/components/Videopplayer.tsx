"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useVideoGestures } from "@/hooks/useVideoGestures";


interface VideoProps {
  video: any;
  videoId: string;
  onNextVideo?: () => void;
}

const Videoplayer = ({
  video,
  videoId,
  onNextVideo,
}: VideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  const viewCounted = useRef(false);

  const [overlay, setOverlay] = useState<
    "play" | "forward" | "rewind" | null
  >(null);

  const videoSrc = video?.filename
    ? `http://localhost:5000/uploads/${video.filename}`
    : null;

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : {};

  const plan = user.plan || "Free";

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
      if (
        maxTime !== Infinity &&
        player.currentTime >= maxTime
      ) {
        player.pause();

        alert(
          `Your ${plan} plan allows only ${
            maxTime / 60
          } minutes of watching.`
        );

        player.currentTime = maxTime;
      }
    };

    player.addEventListener("timeupdate", checkTime);

    return () => {
      player.removeEventListener("timeupdate", checkTime);
    };
  }, [plan, maxTime]);

  // ---------------- Overlay ----------------

  const showOverlay = (
    type: "play" | "forward" | "rewind"
  ) => {
    setOverlay(type);

    setTimeout(() => {
      setOverlay(null);
    }, 700);
  };

  // ---------------- Gestures ----------------

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

    onNextVideo: () => {
      onNextVideo?.();
    },

    onOpenComments: () => {
      document
        .getElementById("comments")
        ?.scrollIntoView({
          behavior: "smooth",
        });
    },

    onCloseWebsite: () => {
      window.close();
    },
  });

  // ---------------- UI ----------------

  if (!videoSrc) {
    return (
      <div className="aspect-video bg-black text-white flex items-center justify-center">
        No video found
      </div>
    );
  }
  useEffect(() => {
  const player = videoRef.current;

  if (!player) return;

  const handleView = async () => {
    if (
      !viewCounted.current &&
      player.currentTime >= 5
    ) {
      viewCounted.current = true;

      try {
        await fetch(
          `http://localhost:5000/video/${videoId}/view`,
          {
            method: "PUT",
          }
        );

        console.log("View counted");
      } catch (err) {
        console.error(err);
      }
    }
  };

  player.addEventListener(
    "timeupdate",
    handleView
  );

  return () =>
    player.removeEventListener(
      "timeupdate",
      handleView
    );
}, [videoId]);
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
    if (saved) return;

    // Save only after 5 seconds
    if (player.currentTime < 5) return;

    saved = true;

    try {
      const response = await fetch(
        "http://localhost:5000/history",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user._id,
            videoId: video._id,
          }),
        }
      );

      const data = await response.json();

      console.log("History Saved:", data);
    } catch (err) {
      console.error("History Error:", err);
    }
  };

  player.addEventListener("timeupdate", saveHistory);

  return () => {
    player.removeEventListener("timeupdate", saveHistory);
  };
}, [video]);

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
          type={video.filetype || "video/mp4"}
        />
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