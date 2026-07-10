"use client";

import { RefObject, useEffect, useRef } from "react";

type Zone = "left" | "center" | "right";

interface UseVideoGesturesProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  onNextVideo?: () => void;
  onOpenComments?: () => void;
  onCloseWebsite?: () => void;
  onPlayPause?: () => void;
  onForward?: () => void;
  onBackward?: () => void;
}

export function useVideoGestures({
  videoRef,
  onNextVideo,
  onOpenComments,
  onCloseWebsite,
  onPlayPause,
  onForward,
  onBackward,
}: UseVideoGesturesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const tapCount = useRef(0);
  const tapTimer = useRef<NodeJS.Timeout | null>(null);

  const zoneRef = useRef<Zone>("center");

  const startX = useRef(0);
  const startY = useRef(0);

  const getZone = (x: number): Zone => {
    const width = window.innerWidth;

    if (x < width / 3) return "left";
    if (x > (width * 2) / 3) return "right";

    return "center";
  };

  const processTap = () => {
    const player = videoRef.current;

    if (!player) return;

    const zone = zoneRef.current;

    // Single tap
    if (tapCount.current === 1) {
      if (zone === "center") {
        if (player.paused) {
          player.play();
        } else {
          player.pause();
        }

        onPlayPause?.();
      }
    }

    // Double tap
    if (tapCount.current === 2) {
      if (zone === "left") {
        player.currentTime = Math.max(0, player.currentTime - 10);
        onBackward?.();
      }

      if (zone === "right") {
        player.currentTime = Math.min(
          player.duration,
          player.currentTime + 10
        );
        onForward?.();
      }
    }

    // Triple tap
    if (tapCount.current === 3) {
      if (zone === "center") {
        onNextVideo?.();
      }

      if (zone === "left") {
        onOpenComments?.();
      }

      if (zone === "right") {
        onCloseWebsite?.();
      }
    }

    tapCount.current = 0;
  };

  useEffect(() => {
    const element = containerRef.current;

    if (!element) return;

    const pointerDown = (e: PointerEvent) => {
      zoneRef.current = getZone(e.clientX);

      tapCount.current++;

      if (tapTimer.current) {
        clearTimeout(tapTimer.current);
      }

      tapTimer.current = setTimeout(processTap, 300);
    };

    const touchStart = (e: TouchEvent) => {
      startX.current = e.touches[0].clientX;
      startY.current = e.touches[0].clientY;
    };

    const touchEnd = (e: TouchEvent) => {
      const player = videoRef.current;

      if (!player) return;

      const endX = e.changedTouches[0].clientX;
      const diff = endX - startX.current;

      if (Math.abs(diff) < 80) return;

      if (diff > 0) {
        player.currentTime = Math.min(
          player.duration,
          player.currentTime + 10
        );

        onForward?.();
      } else {
        player.currentTime = Math.max(
          0,
          player.currentTime - 10
        );

        onBackward?.();
      }
    };

    element.addEventListener("pointerdown", pointerDown);
    element.addEventListener("touchstart", touchStart);
    element.addEventListener("touchend", touchEnd);

    return () => {
      element.removeEventListener("pointerdown", pointerDown);
      element.removeEventListener("touchstart", touchStart);
      element.removeEventListener("touchend", touchEnd);
    };
  }, []);

  return containerRef;
}