const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createStudentProfile,
  getStudentProfile,
  updateStudentProfile,
} = require("../controllers/studentController");

// Create Profile
router.post("/profile", protect, createStudentProfile);

// Get Profile
router.get("/profile", protect, getStudentProfile);

// Update Profile
router.put("/profile", protect, updateStudentProfile);

module.exports = router;