"use client";

interface Video {
  _id: string;
  videotitle: string;
  thumbnail: string;
  views: number;
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
            <div
              key={video._id}
              className="bg-white rounded-xl overflow-hidden shadow border hover:shadow-lg transition"
            >
              <img
                src={video.thumbnail}
                alt={video.videotitle}
                className="w-full h-48 object-cover"
              />

              <div className="p-4">
                <h3 className="font-semibold text-lg line-clamp-2">
                  {video.videotitle}
                </h3>

                <p className="text-gray-500 text-sm mt-2">
                  {video.views.toLocaleString()} views
                </p>

                <p className="text-gray-400 text-xs mt-1">
                  Anime Channel
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChannelVideos;