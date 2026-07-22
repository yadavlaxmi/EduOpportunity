const User = require("../models/User");

const getProfile = async (req, res) => {
  try {

    res.status(200).json({
      success: true,
      user: req.user,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        ...req.body,
        profileCompleted: true,
      },
      {
        new: true,
      }
    ).select("-password");

    res.status(200).json({
      success: true,
      user: updatedUser,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
const deactivateAccount = async (req, res) => {
  try {

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        isActive: false,
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Account deactivated successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};

module.exports = {
  getProfile,
  updateProfile,
  deactivateAccount,
};