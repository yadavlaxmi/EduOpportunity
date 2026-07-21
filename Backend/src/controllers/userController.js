const User = require("../models/User");

const getProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user.userId).select("-password");

    res.status(200).json({
      success: true,
      user,
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
};