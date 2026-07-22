const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
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
router.post(
  "/profile",
  protect,
  authorize("organization"),
  createProfile
);

router.get(
  "/profile",
  protect,
  authorize("organization"),
  getProfile
);

router.put(
  "/profile",
  protect,
  authorize("organization"),
  updateProfile
);

module.exports = router;