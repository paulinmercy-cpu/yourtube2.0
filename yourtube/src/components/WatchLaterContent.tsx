"use client";

import Link from "next/link";
import { MoreVertical, Play } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";

interface WatchLaterItem {
  _id: string;
  createdAt: string;
  videoId: {
    _id: string;
    videotitle: string;
    videochannel: string;
    views: number;
    createdAt: string;
    filepath: string;
    thumbnail?: string;
  };
}

export default function WatchLaterContent() {
  const [watchLater, setWatchLater] = useState<WatchLaterItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWatchLater();
  }, []);

  const loadWatchLater = async () => {
    try {
      const user = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      if (!user?._id) {
        setLoading(false);
        return;
      }

      const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/watchlater/${user._id}`
);

      const data = await response.json();

      console.log("Watch Later:", data);

      if (data.success) {
        setWatchLater(data.videos);
      } else {
        setWatchLater([]);
      }
    } catch (error) {
      console.error(error);
      setWatchLater([]);
    } finally {
      setLoading(false);
    }
  };

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
        Watch Later
      </h1>

      <div className="flex justify-between items-center mt-2 mb-8">
        <p className="text-gray-500">
          {watchLater.length} Videos
        </p>

        <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg">
          <Play size={16} />
          Play All
        </button>
      </div>

      {watchLater.length === 0 ? (
        <div className="text-center mt-24">
          <h2 className="text-2xl font-semibold">
            No videos saved
          </h2>

          <p className="text-gray-500 mt-2">
            Save videos to watch them later.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {watchLater.map((item) => (
            <div
              key={item._id}
              className="flex gap-4 p-3 rounded-xl hover:bg-gray-100 transition"
            >
              <Link href={`/watch/${item.videoId._id}`}>
                <img
  src={
  item.videoId.thumbnail
    ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${item.videoId.thumbnail}`
    : "/thumbnail.jpg"
}
  className="w-[220px] h-[130px] rounded-xl object-cover"
  alt={item.videoId.videotitle}
/>
              </Link>

              <div className="flex-1">
                <Link href={`/watch/${item.videoId._id}`}>
                  <h2 className="text-lg font-semibold hover:text-blue-600">
                    {item.videoId.videotitle}
                  </h2>
                </Link>

                <p className="text-gray-600 mt-1">
                  {item.videoId.videochannel}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  {item.videoId.views.toLocaleString()} views •{" "}
                  {formatDistanceToNow(
                    new Date(item.videoId.createdAt)
                  )}{" "}
                  ago
                </p>

                <p className="text-xs text-gray-400 mt-2">
                  Added{" "}
                  {formatDistanceToNow(
                    new Date(item.createdAt)
                  )}{" "}
                  ago
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