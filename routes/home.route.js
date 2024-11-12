const express = require("express");
const {
  getHomePage,
  getLoginPage,
  Login,
} = require("../controller/home.controller");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();

router.get("/", verifyToken, getHomePage);
router.get("/get-login", getLoginPage);
router.post("/login", Login);

module.exports = router;
