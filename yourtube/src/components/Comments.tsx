"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosinstance";

interface Comment {
  _id: string;
  videoId: string;
  username: string;
  text: string;
}

const Comments = ({ videoId }: { videoId: string }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ EDIT STATES
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState("");

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

  // ✅ ADD COMMENT
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      setIsSubmitting(true);

      const res = await axiosInstance.post("/comment/add", {
        videoId,
        username: user.name,
        text: newComment,
      });

      if (res.data.success) {
        const newC = res.data.comment;

        const normalizedComment = {
          _id: newC._id,
          videoId: newC.videoId,
          username:
            newC.username || newC.usercommented || "User",
          text: newC.text || newC.commentbody || "",
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
        text: editedText,
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
      <div className="space-y-6">
        {comments.map((comment) => {
          const username = comment.username || "User";
          const text = comment.text || "";

          return (
            <div key={comment._id} className="flex gap-3">
              {/* ✅ SAFE AVATAR LETTER */}
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-semibold">
                {username.charAt(0)}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{username}</h4>
                  <span className="text-sm text-gray-500">
                    Just now
                  </span>
                </div>

                {/* ✅ EDIT MODE */}
                {editingId === comment._id ? (
                  <div className="mt-2">
                    <input
                      value={editedText}
                      onChange={(e) =>
                        setEditedText(e.target.value)
                      }
                      className="border p-2 w-full"
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
                  <p className="text-gray-800 mt-1">{text}</p>
                )}

                {/* ACTIONS */}
                <div className="flex gap-4 mt-2">
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