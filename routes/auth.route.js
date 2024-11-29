const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const {
  getLoginPage,
  Login,
  Logout,
  getNewAdminPage,
  createNewAdmin,
  deleteAdmin,
  mainAdmin,
} = require("../controller/auth.controller");
const router = express.Router();

router.get("/get-login", getLoginPage);
router.post("/login", Login);
router.get("/logout", verifyToken, Logout);
router.get("/get-create-new-admin", verifyToken, getNewAdminPage);
router.post("/create-new-admin", createNewAdmin);
router.delete("/delete-admin/:adminId", verifyToken, deleteAdmin);
router.patch("/set-admin-main", verifyToken, mainAdmin);

module.exports = router;
