const Olympiad = require("../models/Olympiad");

// ====================================
// Create Olympiad
// ====================================
const createOlympiad = async (req, res) => {
  try {
    const olympiad = await Olympiad.create({
      organization: req.user._id,
      ...req.body,
    });

    res.status(201).json({
      success: true,
      message: "Olympiad created successfully",
      olympiad,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ====================================
// Get All Published Olympiads
// ====================================
const getAllOlympiads = async (req, res) => {
  try {
    const olympiads = await Olympiad.find({
      isActive: true,
      status: "Published",
    })
      .populate("organization", "fullName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: olympiads.length,
      olympiads,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ====================================
// Get Olympiad By Id
// ====================================
const getOlympiadById = async (req, res) => {
  try {
    const olympiad = await Olympiad.findById(req.params.id).populate(
      "organization",
      "fullName email"
    );

    if (!olympiad) {
      return res.status(404).json({
        success: false,
        message: "Olympiad not found",
      });
    }

    res.status(200).json({
      success: true,
      olympiad,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ====================================
// Get My Olympiads
// ====================================
const getMyOlympiads = async (req, res) => {
  try {
    const olympiads = await Olympiad.find({
      organization: req.user._id,
      isActive: true,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: olympiads.length,
      olympiads,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ====================================
// Update Olympiad
// ====================================
const updateOlympiad = async (req, res) => {
  try {
    const olympiad = await Olympiad.findById(req.params.id);

    if (!olympiad) {
      return res.status(404).json({
        success: false,
        message: "Olympiad not found",
      });
    }

    // Organization can update only their own olympiad
    if (
      olympiad.organization.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const updatedOlympiad = await Olympiad.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Olympiad updated successfully",
      olympiad: updatedOlympiad,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ====================================
// Soft Delete Olympiad
// ====================================
const deleteOlympiad = async (req, res) => {
  try {
    const olympiad = await Olympiad.findById(req.params.id);

    if (!olympiad) {
      return res.status(404).json({
        success: false,
        message: "Olympiad not found",
      });
    }

    // Organization can delete only their own olympiad
    if (
      olympiad.organization.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await Olympiad.findByIdAndUpdate(
      req.params.id,
      {
        isActive: false,
        status: "Closed",
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Olympiad deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  createOlympiad,
  getAllOlympiads,
  getOlympiadById,
  getMyOlympiads,
  updateOlympiad,
  deleteOlympiad,
};