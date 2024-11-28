const express = require("express");
const {
  getOrders,
  getSalesResportPage,
} = require("../controller/ordermangement.controller");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();

router.get("/order-mangements", verifyToken, getOrders);
router.get("/sales-reports", verifyToken, getSalesResportPage);

module.exports = router;
