const express = require("express");
const {
  getUserMangementPage,
  deleteUser,
} = require("../controller/usermangement.controller");
const router = express.Router();

router.get("/user-mangement", getUserMangementPage);
router.delete("/user-delete/:id", deleteUser);

module.exports = router;
