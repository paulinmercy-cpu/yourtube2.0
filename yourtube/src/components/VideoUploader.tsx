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
  const [videoTitle, setVideoTitle] = useState("");
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (
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

  const resetForm = () => {
    setVideoFile(null);
    setVideoTitle("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadVideo = async () => {
    if (!videoFile) {
      alert("Please select a video");
      return;
    }

    if (!videoTitle.trim()) {
      alert("Please enter a video title");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("videotitle", videoTitle);
      formData.append("video", videoFile);
      formData.append(
        "videochannel",
        channelName || "My Channel"
      );
      formData.append("category", "Entertainment");
      formData.append("uploader", "Paulin Mercy");

      const response = await fetch(
        "http://localhost:5000/video/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      console.log("Server Response:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Upload failed"
        );
      }

      onVideoUpload?.({
        _id: data.video._id,
        videotitle: data.video.videotitle,
        thumbnail: "/thumb.jpg",
        views: data.video.views || 0,
      });

      alert("Video uploaded successfully!");

      resetForm();
    } catch (error: any) {
      console.error("Upload Error:", error);

      alert(
        error.message || "Video upload failed"
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border rounded-xl p-6 bg-white">
      <h2 className="text-3xl font-bold mb-6">
        Upload a Video
      </h2>

      {!videoFile ? (
        <div
          className="border-2 border-dashed rounded-xl p-16 text-center cursor-pointer hover:bg-gray-50"
          onClick={() =>
            fileInputRef.current?.click()
          }
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <h3 className="text-xl font-medium">
            Select a Video
          </h3>

          <p className="text-gray-500 mt-2">
            Click here to choose a video file
          </p>
        </div>
      ) : (
        <div>
          <p className="font-semibold">
            Selected File:
          </p>

          <p className="text-gray-600">
            {videoFile.name}
          </p>

          <input
            type="text"
            value={videoTitle}
            onChange={(e) =>
              setVideoTitle(e.target.value)
            }
            placeholder="Enter video title"
            className="w-full border rounded-lg p-3 mt-4"
          />

          <div className="flex gap-3 mt-4">
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
              className="bg-red-600 text-white px-4 py-2 rounded-lg"
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