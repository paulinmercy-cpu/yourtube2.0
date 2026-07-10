"use client";

import Link from "next/link";
import { MoreVertical } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";

interface LikedVideo {
  _id: string;
  createdAt: string;
  videoId: {
    _id: string;
    videotitle: string;
    videochannel: string;
    views: number;
    createdAt: string;
    thumbnail?: string;
    filename?: string;
  };
}

export default function LikeContent() {
  const [likedVideos, setLikedVideos] = useState<LikedVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLikedVideos();
  }, []);

  async function loadLikedVideos() {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      if (!user?._id) {
        setLoading(false);
        return;
      }

      const response = await fetch(
        `http://localhost:5000/like/liked/${user._id}`
      );

      const data = await response.json();

      console.log("Liked Videos:", data);

      if (data.success) {
        setLikedVideos(data.videos);
      } else {
        setLikedVideos([]);
      }
    } catch (error) {
      console.error(error);
      setLikedVideos([]);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[500px]">
        <h2 className="text-xl">Loading...</h2>
      </div>
    );
  }

  return (
    <div className="w-full px-8 py-6">
      <h1 className="text-3xl font-bold">
        Liked Videos
      </h1>

      <p className="text-gray-500 mt-2 mb-8">
        {likedVideos.length} Videos
      </p>

      {likedVideos.length === 0 ? (
        <div className="text-center mt-24">
          <h2 className="text-2xl font-semibold">
            No liked videos
          </h2>

          <p className="text-gray-500 mt-2">
            Like a video to see it here.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {likedVideos.map((item) => (
            <div
              key={item._id}
              className="flex gap-4 p-3 rounded-xl hover:bg-gray-100 transition"
            >
              {/* Thumbnail */}
              <Link href={`/watch/${item.videoId._id}`}>
                <img
                  src={
                    item.videoId.thumbnail
                      ? `http://localhost:5000/uploads/${item.videoId.thumbnail}`
                      : "/thumbnail.jpg"
                  }
                  alt={item.videoId.videotitle}
                  className="w-[220px] h-[130px] rounded-xl object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/thumbnail.jpg";
                  }}
                />
              </Link>

              {/* Details */}
              <div className="flex-1">
                <Link href={`/watch/${item.videoId._id}`}>
                  <h2 className="text-lg font-semibold hover:text-blue-600 line-clamp-2">
                    {item.videoId.videotitle}
                  </h2>
                </Link>

                <p className="text-gray-600 mt-2">
                  {item.videoId.videochannel}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  {item.videoId.views.toLocaleString()} views •{" "}
                  {formatDistanceToNow(
                    new Date(item.videoId.createdAt),
                    { addSuffix: true }
                  )}
                </p>

                <p className="text-xs text-gray-400 mt-2">
                  Liked{" "}
                  {formatDistanceToNow(
                    new Date(item.createdAt),
                    { addSuffix: true }
                  )}
                </p>
              </div>

              <button className="p-2 rounded-full hover:bg-gray-200">
                <MoreVertical size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}