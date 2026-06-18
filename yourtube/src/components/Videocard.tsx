"use client";

import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";

export default function Videocard({ video }: any) {
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

  return (
    <div className="cursor-pointer">
      <div className="rounded-xl overflow-hidden bg-black">
        <video
          src={video.filepath}
          className="w-full aspect-video object-cover"
          muted
        />
      </div>

      <div className="flex gap-3 mt-3">
        <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center">
          {video.videochannel?.[0]}
        </div>

        <div>
          <h3 className="font-medium line-clamp-2">
            {video.videotitle}
          </h3>

          <p className="text-sm text-gray-600">
            {video.videochannel}
          </p>

          <p className="text-sm text-gray-500">
            {video.views?.toLocaleString() || 0} views
            {timeAgo && ` • ${timeAgo}`}
          </p>
        </div>
      </div>
    </div>
  );
}