"use client";

import { useEffect, useState } from "react";

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
}

const SearchResult = ({
  query,
}: SearchResultProps) => {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    const allVideos: Video[] = [
      {
        _id: "1",
        videotitle:
          "The Apothecary Diaries Episode 1",
        videochannel: "Anime Channel",
        thumbnail:
          "https://picsum.photos/400/250?random=1",
        views: 45000,
        uploader: "Anime Lover",
        createdAt: new Date().toISOString(),
      },
      {
        _id: "2",
        videotitle:
          "Solo Leveling Episode 12",
        videochannel: "Anime Channel",
        thumbnail:
          "https://picsum.photos/400/250?random=2",
        views: 67000,
        uploader: "Anime Lover",
        createdAt: new Date().toISOString(),
      },
      {
        _id: "3",
        videotitle: "Perfect Pasta Tutorial",
        videochannel: "Cooking Channel",
        thumbnail:
          "https://picsum.photos/400/250?random=3",
        views: 23000,
        uploader: "Chef Master",
        createdAt: new Date().toISOString(),
      },
    ];

    const results = allVideos.filter(
      (video) =>
        video.videotitle
          .toLowerCase()
          .includes(query.toLowerCase()) ||
        video.videochannel
          .toLowerCase()
          .includes(query.toLowerCase())
    );

    setVideos(results);
  }, [query]);

  if (videos.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold">
          No Results Found
        </h2>

        <p className="text-gray-500 mt-2">
          Try another search keyword.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {videos.map((video) => (
        <div
          key={video._id}
          className="flex gap-4 border-b pb-4"
        >
          <img
            src={video.thumbnail}
            alt={video.videotitle}
            className="w-80 h-44 rounded-lg object-cover"
          />

          <div>
            <h2 className="text-lg font-semibold">
              {video.videotitle}
            </h2>

            <p className="text-gray-500">
              {video.views.toLocaleString()} views
            </p>

            <p className="text-gray-500">
              {video.videochannel}
            </p>

            <p className="text-gray-500">
              Uploaded by {video.uploader}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchResult;