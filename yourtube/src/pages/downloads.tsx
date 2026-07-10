"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
  Search,
  Download,
  Play,
  MoreVertical,
  Crown,
} from "lucide-react";

interface DownloadItem {
  _id: string;
  videoId: string;
  videoTitle: string;
  videoUrl: string;
  thumbnail: string;
  channelName: string;
  createdAt: string;
}
export default function Downloads() {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchDownloads();
  }, []);

  const fetchDownloads = async () => {
    try {
      const currentUser = JSON.parse(
        localStorage.getItem("user") || "{}"
      );
      console.log("Current User:", currentUser);
console.log("User ID:", currentUser._id);

      if (!currentUser?._id) {
        setError("Please login first.");
        setLoading(false);
        return;
      }

      const res = await axios.get(
        `http://localhost:5000/download/${currentUser._id}`
      );

      setDownloads(res.data.downloads || []);
    } catch (err) {
      console.log(err);
      setError("Failed to load downloads.");
    } finally {
      setLoading(false);
    }
  };

  const filteredDownloads = useMemo(() => {
    return downloads.filter((video) =>
      video.videoTitle
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [downloads, search]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="animate-pulse space-y-8">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex gap-6"
            >
              <div className="w-80 h-44 rounded-xl bg-gray-200" />

              <div className="flex-1 space-y-4">
                <div className="h-6 bg-gray-200 rounded w-2/3" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-4 bg-gray-200 rounded w-1/4" />
                <div className="flex gap-3">
                  <div className="h-10 w-28 bg-gray-200 rounded-full" />
                  <div className="h-10 w-40 bg-gray-200 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-10 py-8">

        <div className="flex items-start justify-between flex-wrap gap-6 mb-10">
  {/* Left */}
  <div>
    <h1 className="text-5xl font-bold text-black">
      Downloads
    </h1>

    <p className="text-gray-500 mt-2 text-lg">
      Watch your downloaded videos anytime, even offline.
    </p>

    <p className="text-gray-500 mt-4">
      {filteredDownloads.length} downloaded video
      {filteredDownloads.length !== 1 && "s"}
    </p>
  </div>

  {/* Right */}

</div>

        

        {error && (
          <div className="text-center text-red-500 py-16">
            {error}
          </div>
        )}

        {!error && filteredDownloads.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24">

            <div className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center mb-6">
              <Download
                size={55}
                className="text-gray-400"
              />
            </div>

            <h2 className="text-3xl font-bold mb-3">
              No downloads yet
            </h2>

            <p className="text-gray-500">
              Download videos to watch them offline.
            </p>
          </div>
        )}

        <div className="space-y-8">
                    {filteredDownloads.map((video) => (
            <div
              key={video._id}
              className="group bg-white rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="flex flex-col lg:flex-row">

                {/* Thumbnail */}
                <Link
                  href={`/watch/${video.videoId}`}
                  className="relative lg:w-[360px] h-[220px] flex-shrink-0 bg-gray-100"
                >
                  <img
                    src={
                      video.thumbnail ||
                      "https://placehold.co/640x360/e5e7eb/6b7280?text=No+Thumbnail"
                    }
                    alt={video.videoTitle}
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                    <div className="bg-white rounded-full p-4">
                      <Play
                        size={34}
                        className="fill-red-600 text-red-600"
                      />
                    </div>
                  </div>

                  <span className="absolute bottom-3 right-3 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    ✓ Downloaded
                  </span>
                </Link>

                {/* Content */}
                <div className="flex-1 p-6 flex justify-between">

                  <div className="flex-1">

                    <Link href={`/watch/${video.videoId}`}>
                      <h2 className="text-2xl font-bold text-gray-900 hover:text-red-600 transition line-clamp-2">
                        {video.videoTitle}
                      </h2>
                    </Link>

                    <p className="mt-3 text-gray-600 font-medium">
  {video.channelName}
</p>

                    <p className="mt-2 text-sm text-gray-500">
                      Downloaded on{" "}
                      {new Date(video.createdAt).toLocaleDateString()}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">

                      <Link
                        href={`/watch/${video.videoId}`}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-full transition"
                      >
                        <Play size={18} />
                        Watch Now
                      </Link>

                      <a
  href={`http://localhost:5000/download/file/${encodeURIComponent(video.videoUrl)}`}
  download
  className="flex items-center gap-2 border border-gray-300 hover:bg-gray-100 px-5 py-3 rounded-full transition"
>
  <Download size={18} />
  Download Again
</a>
                        

                    </div>

                  </div>

                  <button className="self-start p-2 rounded-full hover:bg-gray-100 transition">
                    <MoreVertical size={22} />
                  </button>

                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Premium Card */}
        {filteredDownloads.length > 0 && (
          <div className="mt-12 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 text-white p-8">

            <div className="flex flex-col md:flex-row items-center justify-between gap-6">

              <div className="flex items-center gap-5">

                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                  <Crown size={30} />
                </div>

                <div>
                  <h2 className="text-2xl font-bold">
                    Upgrade to Premium
                  </h2>

                  <p className="text-red-100 mt-2">
                    Enjoy unlimited downloads, ad-free videos and premium
                    streaming quality.
                  </p>
                </div>

              </div>

              <button className="bg-white text-red-600 font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition">
                Upgrade Now
              </button>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}