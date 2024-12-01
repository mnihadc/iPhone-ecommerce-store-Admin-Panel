const express = require("express");
const {
  getOrders,
  getSalesResportPage,
  CreateCoupons,
} = require("../controller/ordermangement.controller");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();

router.get("/order-mangements", verifyToken, getOrders);
router.get("/sales-reports", verifyToken, getSalesResportPage);
router.post("/create-coupon", verifyToken, CreateCoupons);

module.exports = router;
