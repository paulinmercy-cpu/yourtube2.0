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
  const [showMore, setShowMore] = useState(false);

  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

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
      const res = await fetch(
        `http://localhost:5000/video/${video._id}/like`,
        {
          method: "PUT",
        }
      );

      const data = await res.json();

      if (data.success) {
        setLikes(data.video.likes);
        setDislikes(data.video.dislikes);

        setLiked(true);
        setDisliked(false);
      }
    } catch (error) {
      console.error("LIKE ERROR:", error);
    }
  };

  // DISLIKE
  const handleDislike = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/video/${video._id}/dislike`,
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
      const res = await fetch(
        `http://localhost:5000/video/${video._id}/watchlater`,
        {
          method: "PUT",
        }
      );

      const data = await res.json();

      if (data.success) {
        setWatchLater(true);
        setWatchLaterCount(
          data.video.watchLater
        );
      }
    } catch (error) {
      console.error(
        "WATCH LATER ERROR:",
        error
      );
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
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200">
            <Download size={16} />
            Download
          </button>

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

      </div>
    </div>
  );
};

export default VideoInfo;