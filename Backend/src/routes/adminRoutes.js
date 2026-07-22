// const express = require("express");

// const router = express.Router();

// const protect = require("../middleware/authMiddleware");
// const isAdmin = require("../middleware/adminMiddleware");

// const {
//   getAllUsers,
//   getUserById,
//   updateUser,
//   changeUserStatus,
//   deleteUser,
// } = require("../controllers/adminController");

// router.use(protect);
// router.use(isAdmin);

// router.get("/users", getAllUsers);

// router.get("/users/:id", getUserById);

// router.put("/users/:id", updateUser);

// router.patch("/users/:id/status", changeUserStatus);

// router.delete("/users/:id", deleteUser);

// module.exports = router;

const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");

const {
  getAllUsers,
  getUserById,
  updateUser,
  changeUserStatus,
  deleteUser,
} = require("../controllers/adminController");

router.use(protect);
router.use(isAdmin);

router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUser);
router.patch("/users/:id/status", changeUserStatus);
router.delete("/users/:id", deleteUser);

module.exports = router;