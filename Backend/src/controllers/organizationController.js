const OrganizationProfile = require("../models/OrganizationProfile");
const User = require("../models/User");

// ===============================
// Create Organization Profile
// ===============================
const createProfile = async (req, res) => {
  try {
    // Only organization can create profile
    if (req.user.role !== "organization") {
      return res.status(403).json({
        success: false,
        message: "Only organizations can create profile",
      });
    }

    // Check if profile already exists
    const existingProfile = await OrganizationProfile.findOne({
      user: req.user._id,
    });

    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: "Organization profile already exists",
      });
    }

    const profile = await OrganizationProfile.create({
      user: req.user._id,
      ...req.body,
    });

    await User.findByIdAndUpdate(req.user._id, {
      profileCompleted: true,
    });

    res.status(201).json({
      success: true,
      message: "Organization profile created successfully",
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

// ===============================
// Get Organization Profile
// ===============================
const getProfile = async (req, res) => {
  try {

    const profile = await OrganizationProfile.findOne({
      user: req.user._id,
    }).populate(
      "user",
      "email role provider profilePicture profileCompleted"
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.status(200).json({
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

// ===============================
// Update Organization Profile
// ===============================
const updateProfile = async (req, res) => {
  try {

    const profile = await OrganizationProfile.findOneAndUpdate(
      {
        user: req.user._id,
      },
      req.body,
      {
        new: true,
      }
    ).populate(
      "user",
      "email role provider profilePicture profileCompleted"
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
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
  createProfile,
  getProfile,
  updateProfile,
};