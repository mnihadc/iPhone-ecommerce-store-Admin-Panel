const express = require("express");
const { getHomePage } = require("../controller/home.controller");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();

router.get("/", verifyToken, getHomePage);

module.exports = router;
