"use client";

import { useState } from "react";
import Videocard from "./Videocard";

const categories = [
  "All",
  "Music",
  "Gaming",
  "Movies",
  "News",
  "Sports",
  "Technology",
  "Comedy",
  "Education",
  "Travel",
];

const videos = [
  {
    _id: "1",
    videotitle: "The Apothecary Diaries Episode 1",
    filename:"The Apothecary Diaries.mp4",
    filetype:"video/mp4",
    filesize:"500MB",
    Like:1250,
    uploader:"Anime_lover",
    videochannel: "Anime",
    category: "Anime",
    views: 1200,
    createdAt: new Date().toISOString(),
    filepath: "/video/The Apothecary Diaries.mp4",
  },
  {
    _id: "2",
    videotitle: "The Apothecary Diaries Episode 2",
    filename:"The Apothecary Diaries.mp4",
    filetype:"video/mp4",
    filesize:"300MB",
    Like:2250,
    uploader:"Anime_lover",
    videochannel: "Anime",
    category: "Anime",
    views: 800,
    createdAt: new Date().toISOString(),
    filepath: "/video/The Apothecary Diaries.mp4",
  },
  {
    _id: "3",
    videotitle: "The Apothecary Diaries Episode 3",
    filename:"The Apothecary Diaries.mp4",
    filetype:"video/mp4",
    filesize:"1000MB",
    Like:5550,
    uploader:"Anime_lover",
    videochannel: "Anime",
    category: "Anime",
    views: 500,
    createdAt: new Date().toISOString(),
    filepath: "/video/The Apothecary Diaries.mp4",
  },
];

export default function Videogrid() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredVideos =
    selectedCategory === "All"
      ? videos
      : videos.filter(
          (video) => video.category === selectedCategory
        );

  return (
    <div className="p-6">
      {/* Category Buttons */}
      <div className="flex gap-3 overflow-x-auto mb-6">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
              selectedCategory === category
                ? "bg-black text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video) => (
          <Videocard key={video._id} video={video} />
        ))}
      </div>
    </div>
  );
}