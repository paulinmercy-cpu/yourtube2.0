"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import Comments from "@/components/Comments";
import RelatedVideos from "@/components/RelatedVideos";
import VideoInfo from "@/components/VideoInfo";
import Videoplayer from "@/components/Videopplayer";
import axiosInstance from "@/lib/axiosinstance";

export default function WatchVideo() {
  const router = useRouter();
  const { id } = router.query;

  const [video, setVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  if (!id) return;

  const fetchVideo = async () => {
    try {
      setLoading(true);

      await fetch(`http://localhost:5000/video/${id}/view`, {
        method: "PUT",
      });

      const response = await fetch(
        `http://localhost:5000/video/${id}`
      );

      const data = await response.json();
      

      
      console.log("VIDEO DATA:", data);
      console.log("FILENAME:", data.filename);
      console.log("FILEPATH:", data.filepath);

      if (data.success) {
        setVideo(data.video);
      }
    } catch (error) {
      console.error("FETCH ERROR:", error);
      setVideo(null);
    } finally {
      setLoading(false);
    }
  };

  fetchVideo();
}, [id]);

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (!video) {
  return (
    <div className="p-6 text-center">
      Video not found
    </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT */}
          <div className="lg:col-span-2">
            <Videoplayer video={video} />
            <VideoInfo video={video} />
            <Comments videoId={video._id} />
          </div>

          {/* RIGHT */}
          <div>
            <RelatedVideos currentVideoId={video._id} />
          </div>

        </div>
      </div>
    </div>
  );
}