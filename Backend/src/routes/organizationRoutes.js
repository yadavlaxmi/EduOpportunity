const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const validate = require("../middleware/validationMiddleware");
const { createOrganizationValidation } = require("../validations/organizationValidation");
const {
  createProfile,
  getProfile,
  updateProfile,
} = require("../controllers/organizationController");

// Create Profile
router.post(
  "/profile",
  protect,
  authorize("organization"),
  createOrganizationValidation,
  validate,
  createProfile
);

// Get Profile
router.get(
  "/profile",
  protect,
  authorize("organization"),
  getProfile
);

// Update Profile
router.put(
  "/profile",
  protect,
  authorize("organization"),
  updateProfile
);

module.exports = router;