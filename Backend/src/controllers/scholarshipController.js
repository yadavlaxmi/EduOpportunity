const Scholarship = require("../models/Scholarship");
const APIFeatures = require("../utils/schlorshipApiFeatures");
// ====================================
// Create Scholarship
// ====================================
const createScholarship = async (req, res) => {
  try {
    const scholarship = await Scholarship.create({
      organization: req.user._id,
      ...req.body,
    });

    res.status(201).json({
      success: true,
      message: "Scholarship created successfully",
      scholarship,
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
// Get All Published Scholarships
// ====================================
// ====================================
// Get All Scholarships
// ====================================
const getAllScholarships = async (req, res) => {
  try {

    const resultPerPage = Number(req.query.limit) || 10;

    const apiFeatures = new APIFeatures(
      Scholarship.find({
        isActive: true,
        status: "Published",
      }).populate("organization", "fullName email"),
      req.query
    )
      .search()
      .filter()
      .sort()
      .pagination(resultPerPage);

    const scholarships = await apiFeatures.query;

    const totalScholarships = await Scholarship.countDocuments({
      isActive: true,
      status: "Published",
    });

    res.status(200).json({
      success: true,
      totalScholarships,
      currentPage: Number(req.query.page) || 1,
      resultPerPage,
      totalPages: Math.ceil(totalScholarships / resultPerPage),
      count: scholarships.length,
      scholarships,
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
// Get Scholarship By Id
// ====================================
const getScholarshipById = async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id).populate(
      "organization",
      "fullName email"
    );

    if (!scholarship) {
      return res.status(404).json({
        success: false,
        message: "Scholarship not found",
      });
    }

    res.status(200).json({
      success: true,
      scholarship,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ====================================
// Get My Scholarships
// ====================================
const getMyScholarships = async (req, res) => {
  try {
    const scholarships = await Scholarship.find({
      organization: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: scholarships.length,
      scholarships,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ====================================
// Update Scholarship
// ====================================
const updateScholarship = async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);

    if (!scholarship) {
      return res.status(404).json({
        success: false,
        message: "Scholarship not found",
      });
    }

    // Organization can update only their own scholarship
    if (
      scholarship.organization.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const updatedScholarship = await Scholarship.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Scholarship updated successfully",
      scholarship: updatedScholarship,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ====================================
// Delete Scholarship
// ====================================
const deleteScholarship = async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);

    if (!scholarship) {
      return res.status(404).json({
        success: false,
        message: "Scholarship not found",
      });
    }

    // Organization can delete only their own scholarship
    if (
      scholarship.organization.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

await Scholarship.findByIdAndUpdate(
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
      message: "Scholarship deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  createScholarship,
  getAllScholarships,
  getScholarshipById,
  getMyScholarships,
  updateScholarship,
  deleteScholarship,
};