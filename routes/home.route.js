const express = require("express");
const {
  getHomePage,
  getLoginPage,
  Login,
} = require("../controller/home.controller");
const router = express.Router();

router.get("/", getHomePage);
router.get("/get-login", getLoginPage);
router.post("/login", Login);

module.exports = router;
