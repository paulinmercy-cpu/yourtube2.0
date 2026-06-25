"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosinstance";

interface Comment {
  _id: string;
  videoId: string;
  username: string;
  text: string;
  city?: string;
  likes?: number;
  dislikes?: number;
}

const Comments = ({ videoId }: { videoId: string }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [city, setCity] = useState("Unknown");

  // ✅ EDIT STATES
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState("");
  const [translatedComments, setTranslatedComments] =
  useState<{ [key: string]: string }>({});

  const [targetLanguage, setTargetLanguage] =
  useState("en");

  const user = {
    name: "Paulin Mercy",
  };

  // ✅ LOAD COMMENTS + NORMALIZE DATA
  const loadComments = async () => {
    try {
      const res = await axiosInstance.get(`/comment/${videoId}`);

      if (res.data.success) {
        const normalized = res.data.comments.map((c: any) => ({
          _id: c._id,
          videoId: c.videoId,
          username: c.username || c.usercommented || "User",
          text: c.text || c.commentbody || "",
          city: c.city || "Unknown",
          likes: c.likes || 0,
          dislikes: c.dislikes || 0,
        }));

        setComments(normalized);
      }
    } catch (error) {
      console.log("GET COMMENTS ERROR:", error);
    }
  };

  useEffect(() => {
    if (videoId) {
      loadComments();
    }
  }, [videoId]);
  useEffect(() => {
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const { latitude, longitude } = position.coords;

        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );

        const data = await res.json();

        setCity(
          data.address.city ||
            data.address.town ||
            data.address.village ||
            "Unknown"
        );
      } catch (error) {
        console.log(error);
      }
    }
  );
}, []);

  // ✅ ADD COMMENT
  const handleAddComment = async () => {
  if (!newComment.trim()) return;

  const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
  
  if (specialCharRegex.test(newComment)) {
    alert("Special characters are not allowed");
    return;
  }
    try {
      setIsSubmitting(true);

      const res = await axiosInstance.post("/comment/add", {
        videoId,
        username: user.name,
        text: newComment,
        city,
      });

      if (res.data.success) {
        const newC = res.data.comment;

        const normalizedComment = {
          _id: newC._id,
          videoId: newC.videoId,
          username:
            newC.username || newC.usercommented || "User",
          text: newC.text || newC.commentbody || "",
          city: newC.city || city,
          likes: newC.likes || 0,
          dislikes: newC.dislikes || 0,
        };

        setComments((prev) => [normalizedComment, ...prev]);
        setNewComment("");
      }
    } catch (error) {
      console.log("ADD COMMENT ERROR:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleLike = async (id: string) => {
  try {
    await axiosInstance.put(`/comment/like/${id}`);
    loadComments();
  } catch (error) {
    console.log(error);
  }
};
  const handleDislike = async (id: string) => {
  try {
    await axiosInstance.put(`/comment/dislike/${id}`);
    loadComments();
  } catch (error) {
    console.log(error);
  }
};

  // ✅ DELETE COMMENT
  const handleDelete = async (id: string) => {
    try {
      const res = await axiosInstance.delete(`/comment/delete/${id}`);

      if (res.data.success) {
        setComments((prev) =>
          prev.filter((comment) => comment._id !== id)
        );
      }
    } catch (error) {
      console.log("DELETE ERROR:", error);
    }
  };

  // ✅ START EDIT
  const handleEdit = (id: string, currentText: string) => {
    setEditingId(id);
    setEditedText(currentText);
  };

  // ✅ SAVE EDIT
  const handleSaveEdit = async (id: string) => {
    
    if (!editedText.trim()) return;

    try {
      const res = await axiosInstance.put(`/comment/edit/${id}`, {
        commentbody: editedText,
      });

      if (res.data.success) {
        setComments((prev) =>
          prev.map((comment) =>
            comment._id === id
              ? { ...comment, text: editedText }
              : comment
          )
        );
        setEditingId(null);
      }
    } catch (error) {
      console.log("EDIT ERROR:", error);
    }
  };
  const handleTranslate = async (
  id: string,
  text: string
) => {
  try {
    const res = await axiosInstance.post(
      "http://localhost:5000/translate",
      {
        text,
        targetLanguage,
      }
    );

    if (res.data.success) {
      setTranslatedComments((prev) => ({
        ...prev,
        [id]: res.data.translatedText,
      }));
    }
  } catch (error) {
    console.log("TRANSLATE ERROR:", error);
  }
};

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-6">
        {comments.length} Comments
      </h2>

      {/* ADD COMMENT */}
      <div className="flex gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-semibold">
          {user.name?.charAt(0) || "U"}
        </div>

        <div className="flex-1">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full border-b border-gray-300 outline-none py-2"
          />

          <div className="flex justify-end mt-3">
            <button
              onClick={handleAddComment}
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {isSubmitting ? "Posting..." : "Comment"}
            </button>
          </div>
        </div>
      </div>

      {/* COMMENTS LIST */}
      <div className="mb-4">
        <label className="mr-2">
          Translate To:
          </label>
          <select
          value={targetLanguage}
          onChange={(e) =>
            setTargetLanguage(e.target.value)
          }
          className="border rounded px-2 py-1"
          >
            <option value="en">English</option>
            <option value="ta">Tamil</option>
            <option value="hi">Hindi</option>
            <option value="fr">French</option>
            <option value="es">Spanish</option>
            <option value="ja">Japanese</option>
            </select>
            </div>
            <div className="space-y-6">
              {comments.map((comment) => {
                const username = comment.username || "User";
                const text = comment.text || "";

    return (
      <div key={comment._id} className="flex gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-semibold">
          {username.charAt(0)}
        </div>

        {/* Comment Content */}
        <div className="flex-1">
          <div>
            <h4 className="font-semibold">{username}</h4>

            <span className="text-xs text-gray-500">
              {comment.city}
            </span>
          </div>

          {/* Edit Mode */}
          {editingId === comment._id ? (
            <div className="mt-2">
              <input
                value={editedText}
                onChange={(e) =>
                  setEditedText(e.target.value)
                }
                className="border p-2 w-full rounded"
              />

              <div className="flex gap-2 mt-2">
                <button
                  onClick={() =>
                    handleSaveEdit(comment._id)
                  }
                  className="text-green-600 text-sm"
                >
                  Save
                </button>

                <button
                  onClick={() => setEditingId(null)}
                  className="text-gray-500 text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
          <>
          <p className="text-gray-800 mt-1">
            {text}
            </p>
            {translatedComments[comment._id] && (
              <p className="text-blue-600 text-sm mt-2">
                Translation:{" "}
                {translatedComments[comment._id]}
                </p>
              )}
              </>
            )}

          {/* Actions */}
          <div className="space-y-6">
          <div className="flex gap-4 mt-2">
            <button
              onClick={() => handleLike(comment._id)}
              className="text-sm"
            >
              👍 {comment.likes}
            </button>

            <button
              onClick={() =>
                handleDislike(comment._id)
              }
              className="text-sm"
            >
              👎 {comment.dislikes}
            </button>

            <button
              onClick={() =>
                handleEdit(comment._id, text)
              }
              className="text-sm text-blue-600"
            >
              Edit
            </button>

            <button
              onClick={() =>
                handleDelete(comment._id)
              }
              className="text-sm text-red-600"
            >
              Delete
            </button>
            <button
            onClick={() =>
              handleTranslate(comment._id, text)
            }
            className="text-sm text-green-600"
            >
              Translate
              </button>
                </div>
            </div>
        </div>
      </div>
    );
  })}
  </div>
  </div>
  );
};

export default Comments;