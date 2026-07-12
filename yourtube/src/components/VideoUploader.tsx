"use client";

import { ChangeEvent, useRef, useState } from "react";

interface UploadedVideo {
  _id: string;
  videotitle: string;
  thumbnail: string;
  views: number;
}

interface VideoUploaderProps {
  channelId?: string;
  channelName?: string;
  onVideoUpload?: (video: UploadedVideo) => void;
}

export default function VideoUploader({
  channelName,
  onVideoUpload,
}: VideoUploaderProps) {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoTitle, setVideoTitle] = useState("");
  const [uploading, setUploading] = useState(false);

  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const handleVideoChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setVideoFile(file);

    if (!videoTitle) {
      setVideoTitle(
        file.name.replace(/\.[^/.]+$/, "")
      );
    }
  };

  const handleThumbnailChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setThumbnailFile(file);
  };

  const resetForm = () => {
    setVideoFile(null);
    setThumbnailFile(null);
    setVideoTitle("");

    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }

    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = "";
    }
  };

  const uploadVideo = async () => {
    if (!videoFile) {
      alert("Please select a video.");
      return;
    }

    

    if (!videoTitle.trim()) {
      alert("Please enter a title.");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("video", videoFile);

      formData.append("videotitle", videoTitle);
      formData.append(
        "videochannel",
        channelName || "My Channel"
      );
      formData.append("category", "Entertainment");
      formData.append("uploader", "Paulin Mercy");

     const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/video/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      console.log("UPLOAD RESPONSE:", data);

      if (!response.ok) {
        throw new Error(data.message);
      }

      onVideoUpload?.({
        _id: data.video._id,
        videotitle: data.video.videotitle,
        thumbnail: data.video.thumbnail,
        views: data.video.views,
      });

      alert("Video uploaded successfully!");

      resetForm();
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border rounded-xl p-6 bg-white">
      <h2 className="text-3xl font-bold mb-6">
        Upload Video
      </h2>

      {!videoFile ? (
        <div
          className="border-2 border-dashed rounded-xl p-16 text-center cursor-pointer hover:bg-gray-50"
          onClick={() => videoInputRef.current?.click()}
        >
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={handleVideoChange}
          />

          <h3 className="text-xl font-medium">
            Select Video
          </h3>

          <p className="text-gray-500 mt-2">
            Click to choose a video
          </p>
        </div>
      ) : (
        <div className="space-y-4">

          <div>
            <p className="font-semibold">
              Selected Video
            </p>

            <p>{videoFile.name}</p>
          </div>

          <input
            type="text"
            value={videoTitle}
            onChange={(e) =>
              setVideoTitle(e.target.value)
            }
            placeholder="Video Title"
            className="w-full border rounded-lg p-3"
          />

          

          <div className="flex gap-3">

            <button
              onClick={resetForm}
              disabled={uploading}
              className="border px-4 py-2 rounded-lg"
            >
              Cancel
            </button>

            <button
              onClick={uploadVideo}
              disabled={uploading}
              className="bg-red-600 text-white px-5 py-2 rounded-lg"
            >
              {uploading
                ? "Uploading..."
                : "Upload Video"}
            </button>

          </div>

        </div>
      )}
    </div>
  );
}