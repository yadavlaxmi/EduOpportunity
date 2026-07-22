

const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {getProfile,updateProfile,deactivateAccount} = require("../controllers/userController");



router.get("/profile",protect,getProfile);
router.put("/profile",protect,updateProfile);
router.patch("/deactivate",protect,deactivateAccount);




module.exports = router;