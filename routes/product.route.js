const express = require("express");
const {
  getCreateProductPage,
  CreateProduct,
  getProductPage,
  editProductPage,
} = require("../controller/product.controller");
const router = express.Router();

router.get("/create-product", getCreateProductPage);
router.post("/add-product", CreateProduct);
router.get("/get-product", getProductPage);
router.get("/edit-product/:id", editProductPage);
 
module.exports = router;
