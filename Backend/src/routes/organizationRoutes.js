const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createProfile,
  getProfile,
  updateProfile,
} = require("../controllers/organizationController");

// Create Profile
router.post("/profile", protect, createProfile);

// Get Profile
router.get("/profile", protect, getProfile);

// Update Profile
router.put("/profile", protect, updateProfile);

module.exports = router;