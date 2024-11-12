const express = require("express");
const { getHomePage, getLoginPage } = require("../controller/home.controller");
const router = express.Router();

router.get("/", getHomePage);
router.get("/get-login", getLoginPage);

module.exports = router;
