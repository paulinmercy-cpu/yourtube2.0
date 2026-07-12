"use client";

import Videogrid from "@/components/Videogrid";


import Link from "next/link";

interface Video {
  _id: string;
  videotitle: string;
  videochannel: string;
  views: number;
  thumbnail?: string;
}

interface VideoCardProps {
  video: Video;
}

export default function Videocard({ video }: VideoCardProps) {
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://yourtube2-0-4-j9xs.onrender.com";

  const thumbnailUrl = video.thumbnail
    ? `${API_URL}/uploads/${video.thumbnail}`
    : "/no-thumbnail.jpg";

  return (
    <Link href={`/watch/${video._id}`} className="block cursor-pointer">
      <div>
        {/* Thumbnail */}
        <div className="rounded-xl overflow-hidden bg-gray-200 aspect-video">
          {thumbnailUrl && (
            <img
              src={thumbnailUrl}
              alt={video.videotitle}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Video Details */}
        <div className="flex gap-3 mt-3">
          {/* Channel Avatar */}
          <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center font-medium text-black">
            {video.videochannel
              ? video.videochannel.charAt(0).toUpperCase()
              : "U"}
          </div>

          {/* Info */}
          <div className="flex-1">
            <h3 className="font-medium text-sm line-clamp-2">
              {video.videotitle || "Untitled Video"}
            </h3>

            <p className="text-sm text-gray-600">
              {video.videochannel || "Unknown Channel"}
            </p>

            <p className="text-sm text-gray-500">
              {(video.views || 0).toLocaleString()} views
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}