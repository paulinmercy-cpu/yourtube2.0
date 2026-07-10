import History from "../Modals/history.js";
import Video from "../Modals/video.js";

// ======================
// SAVE HISTORY
// ======================
export const addHistory = async (req, res) => {
  try {
    const { userId, videoId } = req.body;

    if (!userId || !videoId) {
      return res.status(400).json({
        success: false,
        message: "userId and videoId are required",
      });
    }

    // Remove old entry if already exists
    await History.findOneAndDelete({
      userId,
      videoId,
    });

    const history = new History({
      userId,
      videoId,
    });

    await history.save();

    res.status(201).json({
      success: true,
      message: "History saved",
      history,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================
// GET HISTORY
// ======================
export const getHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    const history = await History.find({
      userId,
    })
      .sort({ watchedOn: -1 })
      .populate("videoId");

    res.status(200).json({
      success: true,
      history,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================
// DELETE ONE HISTORY
// ======================
export const deleteHistory = async (req, res) => {
  try {
    const { id } = req.params;

    await History.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "History removed",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================
// CLEAR HISTORY
// ======================
export const clearHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    await History.deleteMany({
      userId,
    });

    res.status(200).json({
      success: true,
      message: "History cleared",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};