"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  Download,
  MoreHorizontal,
  Clock3,
} from "lucide-react";



const VideoInfo = ({ video }: any) => {

  const [showPremiumPopup, setShowPremiumPopup] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [downloadBlocked, setDownloadBlocked] = useState(false);

  const [likes, setLikes] = useState(
    video?.likes || 0
  );

  const [dislikes, setDislikes] = useState(
    video?.dislikes || 0
  );

  const [watchLater, setWatchLater] =
    useState(false);

  const [watchLaterCount, setWatchLaterCount] =
  useState(video?.watchLater || 0);
  

  // LIKE
  const handleLike = async () => {
  try {
    const user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    if (!user?._id) {
      alert("Please login first");
      return;
    }

    const res = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/like/like/${video._id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user._id,
        }),
      }
    );

    const data = await res.json();

console.log("Status:", res.status);
console.log("Response:", data);

if (data.success) {
  setLiked(data.liked);
  setLikes(data.likes);

  if (data.liked) {
    setDisliked(false);
  }
} else {
  alert(data.message);
}
  } catch (error) {
    console.error(error);
  }
};
  

  // DISLIKE
  const handleDislike = async () => {
    try {
      const res = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/video/${video._id}/dislike`,
        {
          method: "PUT",
        }
      );

      const data = await res.json();

      if (data.success) {
        setLikes(data.video.likes);
        setDislikes(data.video.dislikes);

        setDisliked(true);
        setLiked(false);
      }
    } catch (error) {
      console.error(
        "DISLIKE ERROR:",
        error
      );
    }
  };

  // WATCH LATER
  const handleWatchLater = async () => {
  try {
    const user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    if (!user?._id) {
      alert("Please login first");
      return;
    }

    const res = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/watchlater/${video._id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user._id,
        }),
      }
    );

    const data = await res.json();

    if (data.success) {
      setWatchLater(data.saved);
      setWatchLaterCount(data.watchLater);
    }
  } catch (error) {
    console.log(error);
  }
};

  const handleDownload = async () => {
  try {
    const storedUser = localStorage.getItem("user");

    console.log("LOCAL USER:", storedUser);

    const currentUser = storedUser
      ? JSON.parse(storedUser)
      : null;

    console.log("CURRENT USER:", currentUser);

    console.log("VIDEO OBJECT:", video);
    console.log("VIDEO FILENAME:", video?.filename);
    console.log("VIDEO:", video);
    console.log("LOCAL USER:", localStorage.getItem("user"));
    console.log("Thumbnail:", video?.thumbnail);
    console.log("Channel:", video?.videochannel);

    


    const res = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/download`,{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
  userId: currentUser?._id,
  videoId: video?._id,
  title: video?.videotitle,
  url: video?.filename,
  thumbnail: video?.thumbnail,
  channelName: video?.videochannel,
  isPremium: false,
}),
    });

    const data = await res.json();

    if (!data.success) {
      setShowPremiumPopup(true);
      setTimeout(() => {
        setShowPremiumPopup(false);
      }, 3000);
      return;
    }

    const fileUrl = `${process.env.NEXT_PUBLIC_API_URL}/download/file/${video?.filename}`;
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = video?.videotitle || "video.mp4";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("DOWNLOAD ERROR:", error);
  }
};

  return (
    <div className="space-y-3">
      {/* TITLE */}
      <h1 className="text-lg font-semibold">
        {video?.videotitle}
      </h1>

      {/* TOP ROW */}
      <div className="flex items-center justify-between flex-wrap gap-3">

        {/* LEFT */}
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback>
              {video?.videochannel?.charAt(0) || "A"}
            </AvatarFallback>
          </Avatar>

          <div>
            <p className="text-sm font-medium">
              {video?.videochannel}
            </p>

            <p className="text-xs text-gray-500">
              1.2M subscribers
            </p>
          </div>

          <Button className="ml-3 rounded-full px-4 h-9 text-sm bg-black text-white">
            Subscribe
          </Button>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2 flex-wrap">

          {/* LIKE / DISLIKE */}
          <div className="flex items-center bg-gray-100 rounded-full overflow-hidden">

            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 text-sm ${
                liked
                  ? "bg-black text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              <ThumbsUp size={16} />
              {likes}
            </button>

            <div className="w-px h-5 bg-gray-300" />

            <button
              onClick={handleDislike}
              className={`flex items-center gap-2 px-4 py-2 text-sm ${
                disliked
                  ? "bg-black text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              <ThumbsDown size={16} />
              {dislikes}
            </button>

          </div>

          {/* SHARE */}
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200">
            <Share2 size={16} />
            Share
          </button>

          {/* DOWNLOAD */}
          <button
          onClick={handleDownload}
          disabled={downloadBlocked}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm ${
            downloadBlocked
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gray-100 hover:bg-gray-200"
            }`}
            >
              <Download size={16} />
              Download
              </button>
              {/* LIMIT MESSAGE */}
              {downloadBlocked && (
                <div className="mt-2 text-sm text-red-600">
                  ⚠️ Free limit reached (1 download/day). Upgrade to Premium.
                  </div>
                )}

          {/* WATCH LATER */}
          <button
  onClick={handleWatchLater}
  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm ${
    watchLater
      ? "bg-black text-white"
      : "bg-gray-100 hover:bg-gray-200"
  }`}
>
  <Clock3 size={16} />
  Watch Later ({watchLaterCount})
</button>

          {/* MORE */}
          <button className="flex items-center justify-center px-3 py-2 bg-gray-100 rounded-full hover:bg-gray-200">
            <MoreHorizontal size={18} />
          </button>

        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="bg-gray-100 rounded-lg p-3 text-sm space-y-2">

        <p className="font-medium">
          {video?.views || 0} views
        </p>

        <p>
          {showMore
            ? "Full description here..."
            : "Short description..."}
        </p>

        <button
          onClick={() =>
            setShowMore(!showMore)
          }
          className="font-medium"
        >
          {showMore
            ? "Show less"
            : "Show more"}
        </button>
        {showPremiumPopup && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white shadow-2xl rounded-xl px-6 py-4 border w-80">
              <h3 className="text-lg font-semibold text-red-600">
                Premium Required
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  Upgrade to Premium for unlimited downloads.
                  </p>
                  <button
                  onClick={() => setShowPremiumPopup(false)}
                  className="mt-4 w-full bg-black text-white py-2 rounded-lg"
                  >
                    OK
                    </button>
                    </div>
                    </div>
                  )}

      </div>
    </div>
  );
};

export default VideoInfo;