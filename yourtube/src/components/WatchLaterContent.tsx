"use client";

import Link from "next/link";
import { MoreVertical, Play } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";

interface WatchLaterItem {
  _id: string;
  addedAt: Date;
  video: {
    _id: string;
    videotitle: string;
    videochannel: string;
    views: number;
    createdAt: Date;
    filepath: string;
  };
}

export default function WatchLaterContent() {
  const [watchLater, setWatchLater] = useState<WatchLaterItem[]>([]);
  const [loading, setLoading] = useState(true);

  const user = {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
  };

  useEffect(() => {
    if (user) {
      loadWatchLater();
    }
  }, []);

  const loadWatchLater = async () => {
    try {
      const data: WatchLaterItem[] = [
        {
          _id: "1",
          addedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
          video: {
            _id: "1",
            videotitle: "The Apothecary Diaries",
            videochannel: "Tamil Anime",
            views: 50000,
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            filepath: "/video/The Apothecary Diaries.mp4",
          },
        },
        {
          _id: "2",
          addedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
          video: {
            _id: "2",
            videotitle: "The Apothecary Diaries",
            videochannel: "Tamil Anime",
            views: 50000,
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            filepath: "/video/The Apothecary Diaries.mp4",
          },
        },
      ];

      setWatchLater(data);
    } catch (error) {
      console.error("Error loading watch later:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="px-6 py-6">
      <h1 className="text-4xl font-bold mb-8">Watch later</h1>

      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">
          {watchLater.length} videos
        </p>

        <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl">
          <Play size={16} />
          Play all
        </button>
      </div>

      <div className="space-y-4">
        {watchLater.map((item) => (
          <div
            key={item._id}
            className="flex items-start gap-3 group"
          >
            <Link href={`/watch/${item.video._id}`}>
              <video
                src={item.video.filepath}
                className="w-[140px] h-[80px] rounded object-cover"
                muted
              />
            </Link>

            <div className="flex-1">
              <Link href={`/watch/${item.video._id}`}>
                <h3 className="text-[15px] font-medium hover:text-blue-600">
                  {item.video.videotitle}
                </h3>
              </Link>

              <p className="text-sm text-gray-600">
                {item.video.videochannel}
              </p>

              <p className="text-sm text-gray-600">
                {item.video.views.toLocaleString()} views •{" "}
                {formatDistanceToNow(item.video.createdAt)} ago
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Added {formatDistanceToNow(item.addedAt)} ago
              </p>
            </div>

            <button className="p-1 hover:bg-gray-100 rounded-full">
              <MoreVertical size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}