const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  saveScholarship,
  applyScholarship,
  saveOlympiad,
  applyOlympiad,
  getSavedApplications,
  getAppliedApplications,
} = require("../controllers/applicationController");

router.post(
  "/scholarship/:id/save",
  protect,
  authorize("student"),
  saveScholarship
);

router.post(
  "/scholarship/:id/apply",
  protect,
  authorize("student"),
  applyScholarship
);

router.post(
  "/olympiad/:id/save",
  protect,
  authorize("student"),
  saveOlympiad
);

router.post(
  "/olympiad/:id/apply",
  protect,
  authorize("student"),
  applyOlympiad
);

router.get(
  "/me/saved",
  protect,
  authorize("student"),
  getSavedApplications
);

router.get(
  "/me/applied",
  protect,
  authorize("student"),
  getAppliedApplications
);

module.exports = router;