"use client";

import Link from "next/link";

interface Video {
  _id: string;
  videotitle: string;
  thumbnail?: string;
  filename?:string;
  views: number;
  videochannel?: string;
}

interface ChannelVideosProps {
  videos: Video[];
}

const ChannelVideos = ({
  videos,
}: ChannelVideosProps) => {
  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-6">
        Channel Videos
      </h2>

      {videos.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No videos uploaded yet
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <Link
              href={`/watch/${video._id}`}
              key={video._id}
            >
              <div className="bg-white rounded-xl overflow-hidden shadow border hover:shadow-lg transition cursor-pointer">
                <div className="relative w-full h-48 overflow-hidden">
  <img
    className="absolute inset-0 w-full h-full object-cover"
    src={
      video.thumbnail
        ? `http://localhost:5000/uploads/${video.thumbnail}`
        : "/thumbnail.jpg"
    }
    alt={video.videotitle}
  />

  <video
    src={`http://localhost:5000/uploads/${video.filename}`}
    className="absolute inset-0 w-full h-full object-cover opacity-0 hover:opacity-100 transition-opacity"
    muted
    playsInline
    loop
    onMouseEnter={(e) => e.currentTarget.play()}
    onMouseLeave={(e) => {
      e.currentTarget.pause();
      e.currentTarget.currentTime = 0;
    }}
  />
</div>

                <div className="p-4">
                  <h3 className="font-semibold text-lg line-clamp-2">
                    {video.videotitle}
                  </h3>

                  <p className="text-gray-500 text-sm mt-2">
                    {video.views?.toLocaleString() || 0} views
                  </p>

                  <p className="text-gray-400 text-xs mt-1">
                    {video.videochannel || "Paulin Mercy"}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChannelVideos;