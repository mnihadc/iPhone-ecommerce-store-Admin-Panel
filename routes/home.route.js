const express = require("express");
const {
  getHomePage,
  getSettingsPage,
} = require("../controller/home.controller");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();

router.get("/", verifyToken, getHomePage);
router.get("/settings", verifyToken, getSettingsPage);

module.exports = router;
