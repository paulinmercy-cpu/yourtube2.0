import mongoose from "mongoose";
import users from "../Modals/Auth.js";

// ================= LOGIN =================
export const login = async (req, res) => {
  try {
    const { email, name, image } = req.body;

    console.log("LOGIN BODY:", req.body);

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    let existinguser = await users.findOne({
      email,
    });

    if (!existinguser) {
      existinguser = await users.create({
        email,
        name,
        image,
      });
    }

    return res.status(200).json({
      success: true,
      result: existinguser,
    });
  } catch (error) {
    console.error("LOGIN CONTROLLER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET USER =================
export const getUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid User ID",
    });
  }

  try {
    const user = await users.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Get User Error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// ================= UPDATE PROFILE =================
export const updateprofile = async (req, res) => {
  const { id: _id } = req.params;
  const { channelname, description } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({
      message: "User unavailable...",
    });
  }

  try {
    const updatedData =
      await users.findByIdAndUpdate(
        _id,
        {
          $set: {
            channelname,
            description,
          },
        },
        {
          new: true,
        }
      );

    return res.status(200).json(updatedData);
  } catch (error) {
    console.error("Update error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};