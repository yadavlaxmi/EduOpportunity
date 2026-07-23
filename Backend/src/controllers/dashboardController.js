const User = require("../models/User");
const Scholarship = require("../models/Scholarship");
const Olympiad = require("../models/Olympiad");
const Application = require("../models/Application");
// ========================================
// Student Dashboard
// ========================================

const getStudentDashboard = async (req, res) => {
  try {
    const studentId = req.user._id;

    // Total Published Opportunities
    const totalScholarships = await Scholarship.countDocuments({
      isActive: true,
      status: "Published",
    });

    const totalOlympiads = await Olympiad.countDocuments({
      isActive: true,
      status: "Published",
    });

    // Saved Counts
    const savedScholarships = await Application.countDocuments({
      student: studentId,
      opportunityType: "Scholarship",
      status: "Saved",
    });

    const savedOlympiads = await Application.countDocuments({
      student: studentId,
      opportunityType: "Olympiad",
      status: "Saved",
    });

    // Applied Counts
    const appliedScholarships = await Application.countDocuments({
      student: studentId,
      opportunityType: "Scholarship",
      status: "Applied",
    });

    const appliedOlympiads = await Application.countDocuments({
      student: studentId,
      opportunityType: "Olympiad",
      status: "Applied",
    });

    // Featured Scholarships
    const featuredScholarships = await Scholarship.find({
      featured: true,
      isActive: true,
      status: "Published",
    })
      .select("title amount scholarshipType bannerImage lastDate")
      .limit(5);

    // Featured Olympiads
    const featuredOlympiads = await Olympiad.find({
      featured: true,
      isActive: true,
      status: "Published",
    })
      .select("title olympiadType examDate bannerImage registrationEndDate")
      .limit(5);

    res.status(200).json({
      success: true,
      dashboard: {
        totalScholarships,
        totalOlympiads,

        savedScholarships,
        savedOlympiads,

        appliedScholarships,
        appliedOlympiads,

        featuredScholarships,
        featuredOlympiads,
      },
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
// ========================================
// Organization Dashboard
// ========================================

const getOrganizationDashboard = async (req, res) => {
  try {
    const organizationId = req.user._id;

    const totalScholarships = await Scholarship.countDocuments({
      organization: organizationId,
    });

    const publishedScholarships = await Scholarship.countDocuments({
      organization: organizationId,
      status: "Published",
    });

    const draftScholarships = await Scholarship.countDocuments({
      organization: organizationId,
      status: "Draft",
    });

    const closedScholarships = await Scholarship.countDocuments({
      organization: organizationId,
      status: "Closed",
    });

    const totalOlympiads = await Olympiad.countDocuments({
      organization: organizationId,
    });

    const publishedOlympiads = await Olympiad.countDocuments({
      organization: organizationId,
      status: "Published",
    });

    const draftOlympiads = await Olympiad.countDocuments({
      organization: organizationId,
      status: "Draft",
    });

    const closedOlympiads = await Olympiad.countDocuments({
      organization: organizationId,
      status: "Closed",
    });

    res.status(200).json({
      success: true,
      dashboard: {
        totalScholarships,
        publishedScholarships,
        draftScholarships,
        closedScholarships,
        totalOlympiads,
        publishedOlympiads,
        draftOlympiads,
        closedOlympiads,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ========================================
// Admin Dashboard
// ========================================

const getAdminDashboard = async (req, res) => {
  try {
    const students = await User.countDocuments({
      role: "student",
    });

    const organizations = await User.countDocuments({
      role: "organization",
    });

    const scholarships = await Scholarship.countDocuments();

    const olympiads = await Olympiad.countDocuments();

    res.status(200).json({
      success: true,
      dashboard: {
        students,
        organizations,
        scholarships,
        olympiads,
      },
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
  getStudentDashboard,
  getOrganizationDashboard,
  getAdminDashboard,
};