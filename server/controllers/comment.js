import Comment from "../Modals/comment.js";

// ADD COMMENT
export const addComment = async (req, res) => {
  try {
    const { videoId, username, text } = req.body;

    const comment = await Comment.create({
      videoId,
      usercommented: username,
      commentbody: text,
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
export const getComments = async (req, res) => {
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
        { commentbody },
        { new: true }
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

// DELETE COMMENT
export const deleteComment = async (req, res) => {
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