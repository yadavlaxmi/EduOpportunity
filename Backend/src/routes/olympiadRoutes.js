const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  createOlympiad,
  getAllOlympiads,
  getOlympiadById,
  getMyOlympiads,
  updateOlympiad,
  deleteOlympiad,
} = require("../controllers/olympiadController");

// Public APIs
router.get("/", getAllOlympiads);
router.get("/:id", getOlympiadById);

// Organization APIs
router.post(
  "/",
  protect,
  authorize("organization"),
  createOlympiad
);

router.get(
  "/my",
  protect,
  authorize("organization"),
  getMyOlympiads
);

router.put(
  "/:id",
  protect,
  authorize("organization", "admin"),
  updateOlympiad
);

router.delete(
  "/:id",
  protect,
  authorize("organization", "admin"),
  deleteOlympiad
);

module.exports = router;