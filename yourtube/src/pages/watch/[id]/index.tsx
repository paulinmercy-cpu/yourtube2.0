"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import Comments from "@/components/Comments";
import RelatedVideos from "@/components/RelatedVideos";
import VideoInfo from "@/components/VideoInfo";
import Videoplayer from "@/components/Videopplayer";

export default function WatchVideo() {
  const params = useParams();
  const id = params?.id as string;

  const [video, setVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ✅ helper (same pattern everywhere)
  const fetchJSON = async (url: string) => {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Failed: ${res.status}`);
    }

    return res.json();
  };

  useEffect(() => {
    if (!id) return;

    const fetchVideo = async () => {
      try {
        setLoading(true);

        console.log("API:", process.env.NEXT_PUBLIC_API_URL);

        const data = await fetchJSON(
          `${process.env.NEXT_PUBLIC_API_URL}/video/${id}`
        );

        if (data.success) {
          setVideo(data.video);
        } else {
          setVideo(null);
        }
      } catch (err) {
        console.error("FETCH VIDEO ERROR:", err);
        setVideo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

  // UI STATES
  if (!id) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (!video) {
    return (
      <div className="p-6 text-center">
        ❌ Video not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT */}
          <div className="lg:col-span-2">
            <Videoplayer
              video={video}
              videoId={video._id}
            />

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