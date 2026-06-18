"use client";

import Link from "next/link";
import { MoreVertical } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";

interface HistoryItem {
  _id: string;
  watchedon: Date;
  video: {
    _id: string;
    videotitle: string;
    videochannel: string;
    views: number;
    createdAt: Date;
    filepath: string;
  };
}

export default function HistoryContent() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Dummy user (same as your file)
  const user = {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
  };

  // ✅ Load history (mock data for now)
  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, []);

  const loadHistory = async () => {
    try {
      // 🔥 Replace with API later
      const data: HistoryItem[] = [
        {
          _id: "1",
          watchedon: new Date(),
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
          watchedon: new Date(Date.now() - 3 * 60 * 60 * 1000),
          video: {
            _id: "2",
            videotitle: "The Apothecary Diaries Episode 2",
            videochannel: "Tamil Anime",
            views: 48000,
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
            filepath: "/video/The Apothecary Diaries.mp4",
          },
        },
      ];

      setHistory(data);
    } catch (error) {
      console.error("Error loading history:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="px-6 py-4">
      <h1 className="text-2xl font-normal">Watch History</h1>

      <p className="text-sm text-gray-500 mb-4">
        {history.length} videos
      </p>

      <div className="space-y-4">
        {history.map((item) => (
          <div
            key={item._id}
            className="flex items-start gap-3 w-fit group"
          >
            {/* Thumbnail */}
            <Link href={`/watch/${item.video._id}`}>
              <video
                src={item.video.filepath}
                className="w-[140px] h-[80px] rounded object-cover"
                muted
              />
            </Link>

            {/* Details */}
            <div className="min-w-[220px]">
              <Link href={`/watch/${item.video._id}`}>
                <h3 className="text-[15px] font-medium group-hover:text-blue-600">
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
                Watched {formatDistanceToNow(item.watchedon)} ago
              </p>
            </div>

            {/* Three dots */}
            <button className="p-1 hover:bg-gray-100 rounded-full">
              <MoreVertical size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}