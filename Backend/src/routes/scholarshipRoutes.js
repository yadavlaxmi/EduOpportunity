const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const validate = require("../middleware/validationMiddleware");

const {
  createScholarshipValidation,
  updateScholarshipValidation,
} = require("../validations/scholarshipValidation");

const {
  createScholarship,
  getAllScholarships,
  getScholarshipById,
  getMyScholarships,
  updateScholarship,
  deleteScholarship,
} = require("../controllers/scholarshipController");

// ====================
// Public APIs
// ====================

router.get("/", getAllScholarships);

router.get(
  "/my",
  protect,
  authorize("organization"),
  getMyScholarships
);



router.get("/:id", getScholarshipById);


// ====================
// Organization APIs
// ====================

router.post(
  "/",
  protect,
  authorize("organization"),
  createScholarshipValidation,
  validate,
  createScholarship
);


router.put(
  "/:id",
  protect,
  authorize("organization", "admin"),
  updateScholarshipValidation,
  validate,
  updateScholarship
);

router.delete(
  "/:id",
  protect,
  authorize("organization", "admin"),
  deleteScholarship
);

module.exports = router;