"use client";

export default function RelatedVideos({ videos = [] }: any) {
  return (
    <div>
      <h1>Related Videos</h1>

      {Array.isArray(videos) &&
        videos.map((video: any) => (
          <div key={video._id}>
            {video.videotitle}
          </div>
        ))}
    </div>
  );
}