"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";

interface VideoCardProps {
  video: any;
}

export default function Videocard({
  video,
}: VideoCardProps) {
  const [timeAgo, setTimeAgo] = useState("");

  useEffect(() => {
    if (video?.createdAt) {
      setTimeAgo(
        formatDistanceToNow(
          new Date(video.createdAt),
          {
            addSuffix: true,
          }
        )
      );
    }
  }, [video?.createdAt]);

  const videoUrl = video?.filename
    ? `http://localhost:5000/uploads/${video.filename}`
    : "";

  return (
    <Link
      href={`/watch/${video._id}`}
      className="block cursor-pointer"
    >
      <div>
        {/* Video Preview */}
        <div className="rounded-xl overflow-hidden bg-gray-200 aspect-video">
          {videoUrl ? (
            <video
              src={videoUrl}
              className="w-full h-full object-cover"
              muted
              preload="metadata"
              playsInline
              onMouseOver={(e) =>
                e.currentTarget.play()
              }
              onMouseOut={(e) => {
                e.currentTarget.pause();
                e.currentTarget.currentTime = 0;
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              No Preview
            </div>
          )}
        </div>

        {/* Video Info */}
        <div className="flex gap-3 mt-3">
          <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center font-medium">
            {video.videochannel
              ?.charAt(0)
              ?.toUpperCase() || "U"}
          </div>

          <div className="flex-1">
            <h3 className="font-medium text-sm line-clamp-2">
              {video.videotitle}
            </h3>

            <p className="text-sm text-gray-600">
              {video.videochannel ||
                "Unknown Channel"}
            </p>

            <p className="text-sm text-gray-500">
              {(video.views || 0).toLocaleString()}
              {" "}views
              {timeAgo &&
                ` • ${timeAgo}`}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}