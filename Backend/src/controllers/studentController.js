const StudentProfile = require("../models/StudentProfile");
const User = require("../models/User");

// Create Profile
const createStudentProfile = async (req, res) => {
  try {

    const userId = req.user._id;

    const alreadyExists = await StudentProfile.findOne({
      user: userId,
    });

    if (alreadyExists) {
      return res.status(400).json({
        success: false,
        message: "Profile already exists",
      });
    }

    const profile = await StudentProfile.create({
      user: userId,
      ...req.body,
    });

    await User.findByIdAndUpdate(userId, {
      profileCompleted: true,
    });

    res.status(201).json({
      success: true,
      message: "Student Profile Created",
      profile,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};

// Get Profile
const getStudentProfile = async (req, res) => {
  try {

    const profile = await StudentProfile.findOne({
      user: req.user._id,
    }).populate("user", "-password");

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.json({
      success: true,
      profile,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};

// Update Profile
const updateStudentProfile = async (req, res) => {
  try {

    const profile = await StudentProfile.findOneAndUpdate(
      {
        user: req.user._id,
      },
      req.body,
      {
        new: true,
      }
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.json({
      success: true,
      message: "Profile Updated",
      profile,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};

module.exports = {
  createStudentProfile,
  getStudentProfile,
  updateStudentProfile,
};