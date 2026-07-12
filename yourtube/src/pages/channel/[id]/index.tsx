"use client";

import { useEffect, useState } from "react";
import { Bell, User } from "lucide-react";

import VideoUploader from "@/components/VideoUploader";
import ChannelVideos from "@/components/ChannelVideos";

export default function ChannelPage() {
  const [activeTab, setActiveTab] = useState("home");
  const [channel, setChannel] = useState<any>(null);

  const [videos, setVideos] = useState<any[]>([]);
  useEffect(() => {
  const fetchVideos = async () => {
    try {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/video`
  );

      const data = await res.json();

      const myVideos = data.videos.filter(
        (video: any) =>
          video.videochannel === "Paulin Mercy"
      );

      console.log("VIDEOS:", myVideos);

      setVideos(myVideos);
    } catch (error) {
      console.log(error);
    }
  };

  if (channel) {
    fetchVideos();
  }
}, [channel]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const user = JSON.parse(storedUser);

      setChannel({
        _id: user._id,
        channelname:
          user.channelname || user.name || "My Channel",
        description:
          user.description ||
          "Welcome to my YouTube channel",
        subscribers: "0",
        avatar: user.image || "",
        banner:
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200",
      });
    }
  }, []);

  if (!channel) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }
  const totalViews = videos.reduce(
  (total, video) =>
    total + (video.views || 0),
  0
);

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="w-full h-52 overflow-hidden">
        <img
          src={channel.banner}
          alt="banner"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:justify-between py-6">
          <div className="flex gap-6 items-center">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              {channel.avatar ? (
                <img
                  src={channel.avatar}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={50} />
              )}
            </div>

            <div>
              <h1 className="text-4xl font-bold">
                {channel.channelname}
              </h1>

              <p className="text-gray-600">
                @{channel.channelname
                  .toLowerCase()
                  .replace(/\s/g, "")}
              </p>

              <p className="text-gray-600">
                {channel.subscribers} subscribers •
                {" "}
                {videos.length} videos •
                {" "}
                {totalViews} views
              </p>

              <p className="mt-2">
                {channel.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <button className="bg-gray-200 px-4 py-2 rounded-full">
              Edit Channel
            </button>

            <button className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-gray-100">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex gap-8 border-b mb-8">
          {[
            "home",
            "videos",
            "playlists",
            "community",
            "about",
          ].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 capitalize ${
                activeTab === tab
                  ? "border-b-2 border-black font-semibold"
                  : "text-gray-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "home" && (
          <>
            <VideoUploader
              channelId={channel._id}
              channelName={channel.channelname}
              onVideoUpload={(video: any) =>
                setVideos((prev) => [video, ...prev])
              }
            />

            <div className="mt-8">
              <ChannelVideos videos={videos} />
            </div>
          </>
        )}

        {activeTab === "videos" && (
          <ChannelVideos videos={videos} />
        )}

        {activeTab === "about" && (
          <div className="border rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">
              About Channel
            </h2>

            <p>{channel.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}