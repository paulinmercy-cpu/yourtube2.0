import { v4 as uuidv4 } from "uuid";

// Create a new call room
export const createCall = async (req, res) => {
  try {
    const roomId = uuidv4();

    res.status(200).json({
      success: true,
      roomId,
      message: "Call room created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Join an existing room
export const joinCall = async (req, res) => {
  try {
    const { roomId } = req.params;

    res.status(200).json({
      success: true,
      roomId,
      message: "Joined call room",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};