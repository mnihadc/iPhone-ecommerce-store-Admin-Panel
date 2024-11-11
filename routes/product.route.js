const express = require("express");
const {
  getCreateProductPage,
  CreateProduct,
  getProductPage,
  editProductPage,
  updateProduct,
} = require("../controller/product.controller");
const router = express.Router();

router.get("/create-product", getCreateProductPage);
router.post("/add-product", CreateProduct);
router.get("/get-product", getProductPage);
router.get("/edit-product/:id", editProductPage);
router.post("/update-product/:id", updateProduct);

module.exports = router;
