const express = require("express");
const {
  getUserMangementPage,
  deleteUser,
  getAddressMangementPage,
} = require("../controller/usermangement.controller");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();

router.get("/user-mangement", verifyToken, getUserMangementPage);
router.delete("/user-delete/:id", verifyToken, deleteUser);
router.get("/get-user-address-mangement", verifyToken, getAddressMangementPage);

module.exports = router;
