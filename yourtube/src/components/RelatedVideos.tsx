"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface RelatedVideosProps {
  currentVideoId: string;
}

export default function RelatedVideos({
  currentVideoId,
}: RelatedVideosProps) {
  const router = useRouter();

  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/video`);
        const data = await response.json();

        const videoList = data.videos || [];

        const filtered = videoList.filter(
          (video: any) => video._id !== currentVideoId
        );

        setVideos(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [currentVideoId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">
        Related Videos
      </h2>

      {videos.map((video) => (
        <div
          key={video._id}
          onClick={() => router.push(`/watch/${video._id}`)}
          className="flex gap-3 cursor-pointer hover:bg-gray-100 rounded-lg p-2"
        >
          <img
            src={
              video.thumbnailUrl ||
              "/thumbnail.jpg"
            }
            alt={video.videotitle}
            className="w-44 h-24 rounded-lg object-cover"
          />

          <div>
            <h3 className="font-semibold line-clamp-2">
              {video.videotitle}
            </h3>

            <p className="text-sm text-gray-600">
              {video.videochannel}
            </p>

            <p className="text-xs text-gray-500">
              {video.views} views
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}