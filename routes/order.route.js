const express = require("express");
const { getOrders } = require("../controller/ordermangement.controller");
const router = express.Router();

router.get("/order-mangements", getOrders);

module.exports = router;
