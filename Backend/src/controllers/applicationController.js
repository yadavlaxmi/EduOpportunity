const Application = require("../models/Application");


// ====================================
// Save Scholarship
// ====================================

const saveScholarship = async (req, res) => {
  try {

    const existing = await Application.findOne({
      student: req.user._id,
      scholarship: req.params.id,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Scholarship already saved/applied.",
      });
    }

    const application = await Application.create({
      student: req.user._id,
      scholarship: req.params.id,
      opportunityType: "Scholarship",
      status: "Saved",
    });

    res.status(201).json({
      success: true,
      message: "Scholarship saved successfully.",
      application,
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
// Apply Scholarship
// ====================================

const applyScholarship = async (req, res) => {
  try {

    let application = await Application.findOne({
      student: req.user._id,
      scholarship: req.params.id,
    });

    if (application) {

      application.status = "Applied";
      application.appliedAt = new Date();

      await application.save();

    } else {

      application = await Application.create({
        student: req.user._id,
        scholarship: req.params.id,
        opportunityType: "Scholarship",
        status: "Applied",
        appliedAt: new Date(),
      });

    }

    res.status(200).json({
      success: true,
      message: "Scholarship marked as applied.",
      application,
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
// Save Olympiad
// ====================================

const saveOlympiad = async (req, res) => {
  try {

    const existing = await Application.findOne({
      student: req.user._id,
      olympiad: req.params.id,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Olympiad already saved/applied.",
      });
    }

    const application = await Application.create({
      student: req.user._id,
      olympiad: req.params.id,
      opportunityType: "Olympiad",
      status: "Saved",
    });

    res.status(201).json({
      success: true,
      message: "Olympiad saved successfully.",
      application,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};


// ====================================
// Apply Olympiad
// ====================================

const applyOlympiad = async (req, res) => {
  try {

    let application = await Application.findOne({
      student: req.user._id,
      olympiad: req.params.id,
    });

    if (application) {

      application.status = "Applied";
      application.appliedAt = new Date();

      await application.save();

    } else {

      application = await Application.create({
        student: req.user._id,
        olympiad: req.params.id,
        opportunityType: "Olympiad",
        status: "Applied",
        appliedAt: new Date(),
      });

    }

    res.status(200).json({
      success: true,
      message: "Olympiad marked as applied.",
      application,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};


// ====================================
// My Saved
// ====================================

const getSavedApplications = async (req, res) => {
  try {

    const applications = await Application.find({
      student: req.user._id,
      status: "Saved",
    })
      .populate("scholarship")
      .populate("olympiad");

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};


// ====================================
// My Applied
// ====================================

const getAppliedApplications = async (req, res) => {
  try {

    const applications = await Application.find({
      student: req.user._id,
      status: "Applied",
    })
      .populate("scholarship")
      .populate("olympiad");

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};

module.exports = {
  saveScholarship,
  applyScholarship,
  saveOlympiad,
  applyOlympiad,
  getSavedApplications,
  getAppliedApplications,
};