const express = require("express");
const {
  getCreateProductPage,
  CreateProduct,
} = require("../controller/product.controller");
const router = express.Router();

router.get("/create-product", getCreateProductPage);
router.post("/add-product", CreateProduct);

module.exports = router;
