import Comment from "../Modals/comment.js";

// ADD COMMENT
export const addComment = async (req, res) => {
  try {
    const { videoId, username, text, city } =
      req.body;

    // Block special characters
    const specialCharRegex =
      /[^a-zA-Z0-9\s]/;

    if (specialCharRegex.test(text)) {
      return res.status(400).json({
        success: false,
        message:
          "Special characters are not allowed",
      });
    }

    const comment = await Comment.create({
      videoId,
      usercommented: username,
      commentbody: text,
      city,
      likes: 0,
      dislikes: 0,
    });

    res.status(201).json({
      success: true,
      comment,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET COMMENTS
export const getComments = async (
  req,
  res
) => {
  try {
    const comments = await Comment.find({
      videoId: req.params.videoId,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      comments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// EDIT COMMENT
export const editComment = async (req, res) => {
  try {
    const { commentbody } = req.body;

    const updatedComment =
      await Comment.findByIdAndUpdate(
        req.params.id,
        {
          commentbody,
        },
        {
          new: true,
        }
      );

    res.json({
      success: true,
      comment: updatedComment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// LIKE COMMENT
export const likeComment = async (
  req,
  res
) => {
  try {
    const comment =
      await Comment.findById(
        req.params.id
      );

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    comment.likes += 1;

    await comment.save();

    res.json({
      success: true,
      likes: comment.likes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DISLIKE COMMENT
export const dislikeComment = async (
  req,
  res
) => {
  try {
    const comment =
      await Comment.findById(
        req.params.id
      );

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    comment.dislikes += 1;

    // Auto delete after 2 dislikes
    if (comment.dislikes >= 2) {
      await Comment.findByIdAndDelete(
        comment._id
      );

      return res.json({
        success: true,
        message:
          "Comment removed after 2 dislikes",
      });
    }

    await comment.save();

    res.json({
      success: true,
      dislikes: comment.dislikes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE COMMENT
export const deleteComment = async (
  req,
  res
) => {
  try {
    await Comment.findByIdAndDelete(
      req.params.id
    );

    res.json({
      success: true,
      message: "Comment deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};