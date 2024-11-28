const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const {
  getLoginPage,
  Login,
  Logout,
  getNewAdminPage,
} = require("../controller/auth.controller");
const router = express.Router();

router.get("/get-login", getLoginPage);
router.post("/login", Login);
router.get("/logout", Logout);
router.get("/get-create-new-admin", verifyToken, getNewAdminPage);

module.exports = router;
