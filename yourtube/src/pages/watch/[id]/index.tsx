"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Comments from "@/components/Comments";
import RelatedVideos from "@/components/RelatedVideos";
import VideoInfo from "@/components/VideoInfo";
import Videoplayer from "@/components/Videopplayer";

export default function WatchVideo() {
  const router = useRouter();

const { id } = router.query;

if (!router.isReady) {
  return (
    <div className="p-6 text-center">
      Loading...
    </div>
  );
}
  const [video, setVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  if (!id) return;

  const fetchVideo = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:5000/video/${id}`
      );

      const data = await response.json();

      if (data.success) {
        setVideo(data.video);
      } else {
        setVideo(null);
      }
    } catch (error) {
      console.error(error);
      setVideo(null);
    } finally {
      setLoading(false);
    }
  };

  fetchVideo();
}, [id]);

  if (loading) {
    return (
      <div className="p-6 text-center">
        Loading...
      </div>
    );
  }

  if (!video) {
    return (
      <div className="p-6 text-center">
        Video not found
      </div>
    );
  }

  const goToNextVideo = () => {
    alert("Next Video");
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2">
            <Videoplayer
              video={video}
              videoId={video._id}
              onNextVideo={goToNextVideo}
            />

            <VideoInfo video={video} />

            <Comments videoId={video._id} />
          </div>

          <div>
            <RelatedVideos
              currentVideoId={video._id}
            />
          </div>

        </div>
      </div>
    </div>
  );
}