"use client";

import Link from "next/link";
import { MoreVertical, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";

interface HistoryItem {
  _id: string;
  watchedOn: string;

  videoId: {
    _id: string;
    videotitle: string;
    videochannel: string;
    views: number;
    createdAt: string;
    thumbnail: string;
  };
}

export default function HistoryContent() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : null;

  useEffect(() => {
    if (user?._id) {
      loadHistory();
    } else {
      setLoading(false);
    }
  }, []);

  const loadHistory = async () => {
    try {
      const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/history/${user._id}`
);

const data = await response.json();

console.log("USER:", user);
console.log("HISTORY RESPONSE:", data);

      if (data.success) {
        setHistory(data.history);
      }
    } catch (error) {
      console.error("History Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeHistory = async (id: string) => {
   try {
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/history/${id}`, {
    method: "DELETE",
  });
      setHistory((prev) =>
        prev.filter((item) => item._id !== id)
      );
    } catch (error) {
      console.error(error);
    }
  };

  const clearHistory = async () => {
    try {
      await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/history/clear/${user._id}`,
  {
    method: "DELETE",
  }
);

      setHistory([]);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        Loading history...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-6">

      <div className="flex justify-between items-center mb-6">

        <div>
          <h1 className="text-3xl font-bold">
            Watch History
          </h1>

          <p className="text-gray-500">
            {history.length} videos
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            <Trash2 size={18} />
            Clear History
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center mt-20">
          <h2 className="text-2xl font-semibold">
            No Watch History
          </h2>

          <p className="text-gray-500 mt-2">
            Videos you watch will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-5">

          {history.map((item) => (
            <div
              key={item._id}
              className="flex gap-4 hover:bg-gray-100 rounded-xl p-3 transition"
            >
              {/* Thumbnail */}

              <Link href={`/watch/${item.videoId._id}`}>
                <img
                  src={
  item.videoId.thumbnail
    ? item.videoId.thumbnail.startsWith("http")
      ? item.videoId.thumbnail
      : `${process.env.NEXT_PUBLIC_API_URL}/uploads/${item.videoId.thumbnail}`
    : "/thumbnail.jpg"
}
                  className="w-[220px] h-[124px] rounded-xl object-cover"
                  alt={item.videoId.videotitle}
                />
              </Link>

              {/* Details */}

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

                <p className="text-sm text-gray-400 mt-2">
                  Watched{" "}
                  {formatDistanceToNow(
                    new Date(item.watchedOn)
                  )}{" "}
                  ago
                </p>
              </div>

              {/* Delete */}

              <button
                onClick={() =>
                  removeHistory(item._id)
                }
                className="hover:bg-gray-200 rounded-full p-2 h-fit"
              >
                <MoreVertical />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}