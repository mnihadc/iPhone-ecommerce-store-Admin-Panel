const express = require("express");
const {
  getOrders,
  getSalesResportPage,
} = require("../controller/ordermangement.controller");
const router = express.Router();

router.get("/order-mangements", getOrders);
router.get("/sales-reports", getSalesResportPage);

module.exports = router;
