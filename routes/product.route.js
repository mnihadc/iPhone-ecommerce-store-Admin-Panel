const express = require("express");
const { getCreateProductPage } = require("../controller/product.controller");
const router = express.Router();

router.get("/create-product", getCreateProductPage);

module.exports = router;
