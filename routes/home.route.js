const express = require("express");
const {
  getHomePage,
  getSettingsPage,
  updateProfile,
} = require("../controller/home.controller");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();

router.get("/", verifyToken, getHomePage);
router.get("/settings", verifyToken, getSettingsPage);
router.put("/update-profile", verifyToken, updateProfile);

module.exports = router;
