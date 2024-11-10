const express = require("express");
const getUserMangementPage = require("../controller/usermangement.controller");
const router = express.Router();

router.get("/user-mangement", getUserMangementPage);

module.exports = router;
