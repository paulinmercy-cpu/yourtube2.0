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
  const fetchVideos = async () => {
    try {
      console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/video`
      );

      console.log("Status:", res.status);

      const data = await res.json();

      console.log("Response:", data);

      setVideos(data.videos || []);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchVideos();
}, []);

  // Thumbnail URL
  const thumbnailUrl = video?.thumbnail
  ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${video.thumbnail}`
  : "";

  return (
    <Link
      href={`/watch/${video._id}`}
      className="block cursor-pointer"
    >
      <div>
        {/* Thumbnail */}
        <div className="rounded-xl overflow-hidden bg-gray-200 aspect-video">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={video.videotitle}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              No Thumbnail
            </div>
          )}
        </div>

        {/* Video Info */}
        <div className="flex gap-3 mt-3">
          {/* Channel Avatar */}
          <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center font-medium text-black">
            {video.videochannel
              ? video.videochannel.charAt(0).toUpperCase()
              : "U"}
          </div>

          <div className="flex-1">
            <h3 className="font-medium text-sm line-clamp-2">
              {video.videotitle}
            </h3>

            <p className="text-sm text-gray-600">
              {video.videochannel || "Unknown Channel"}
            </p>

            <p className="text-sm text-gray-500">
              {(video.views || 0).toLocaleString()} views
              {timeAgo && ` • ${timeAgo}`}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

function setVideos(arg0: any) {
  throw new Error("Function not implemented.");
}
function setLoading(arg0: boolean) {
  throw new Error("Function not implemented.");
}

