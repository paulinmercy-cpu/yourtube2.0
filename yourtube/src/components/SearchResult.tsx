"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface SearchResultProps {
  query: string;
}

interface Video {
  _id: string;
  videotitle: string;
  videochannel: string;
  thumbnail: string;
  views: number;
  uploader: string;
  createdAt: string;
  category?: string;
}

export default function SearchResult({
  query,
}: SearchResultProps) {
  const router = useRouter();

  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, [query]);

  const fetchVideos = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/video"
      );

      const data = await response.json();

      const allVideos: Video[] = data.videos || [];

      if (!query.trim()) {
        setVideos(allVideos);
        return;
      }

      const results = allVideos.filter((video) => {
        const q = query.toLowerCase();

        return (
          video.videotitle?.toLowerCase().includes(q) ||
          video.videochannel?.toLowerCase().includes(q) ||
          video.category?.toLowerCase().includes(q) ||
          video.uploader?.toLowerCase().includes(q)
        );
      });

      setVideos(results);
    } catch (err) {
      console.error("SEARCH ERROR:", err);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-lg">
        Loading...
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold">
          No videos found
        </h2>

        <p className="text-gray-500 mt-2">
          Try searching with another keyword.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-5">
      {videos.map((video) => (
        <div
          key={video._id}
          onClick={() => router.push(`/watch/${video._id}`)}
          className="flex flex-col md:flex-row gap-4 cursor-pointer hover:bg-gray-100 rounded-xl p-3 transition"
        >
          {/* Thumbnail */}
          <div className="relative flex-shrink-0">
            <img
              src={
                video.thumbnail
                  ? `http://localhost:5000/uploads/${video.thumbnail}`
                  : "/thumbnail.jpg"
              }
              alt={video.videotitle}
              className="w-full md:w-[360px] h-[200px] object-cover rounded-xl"
            />

            <span className="absolute bottom-2 right-2 bg-black text-white text-xs px-2 py-1 rounded">
              10:35
            </span>
          </div>

          {/* Details */}
          <div className="flex flex-col justify-start">
            <h2 className="text-xl font-semibold line-clamp-2">
              {video.videotitle}
            </h2>

            <p className="text-sm text-gray-600 mt-1">
              {video.views?.toLocaleString() || 0} views
            </p>

            <div className="flex items-center gap-2 mt-3">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-semibold">
                {video.videochannel?.charAt(0)}
              </div>

              <span className="text-gray-700 font-medium">
                {video.videochannel}
              </span>
            </div>

            <p className="text-gray-500 mt-3 line-clamp-2">
              Uploaded by {video.uploader}
            </p>

            <p className="text-sm text-gray-400 mt-1">
              Category: {video.category || "General"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}