const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  createStudentProfile,
  getStudentProfile,
  updateStudentProfile,
} = require("../controllers/studentController");

// Create Student Profile
router.post(
  "/profile",
  protect,
  authorize("student"),
  createStudentProfile
);

// Get Student Profile
router.get(
  "/profile",
  protect,
  authorize("student"),
  getStudentProfile
);

// Update Student Profile
router.put(
  "/profile",
  protect,
  authorize("student"),
  updateStudentProfile
);

module.exports = router;