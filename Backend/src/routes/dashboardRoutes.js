const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  getStudentDashboard,
  getOrganizationDashboard,
  getAdminDashboard,
} = require("../controllers/dashboardController");

// Student Dashboard
router.get(
  "/student",
  protect,
  authorize("student"),
  getStudentDashboard
);

// Organization Dashboard
router.get(
  "/organization",
  protect,
  authorize("organization"),
  getOrganizationDashboard
);

// Admin Dashboard
router.get(
  "/admin",
  protect,
  authorize("admin"),
  getAdminDashboard
);

module.exports = router;