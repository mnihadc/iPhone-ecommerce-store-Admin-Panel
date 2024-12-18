const express = require("express");
const {
  getCreateProductPage,
  CreateProduct,
  getProductPage,
  editProductPage,
  updateProduct,
  deleteProduct,
  StockManagmentPage,
  updateStockManagment,
} = require("../controller/product.controller");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();

router.get("/create-product", verifyToken, getCreateProductPage);
router.post("/add-product", verifyToken, CreateProduct);
router.get("/get-product", verifyToken, getProductPage);
router.get("/edit-product/:id", verifyToken, editProductPage);
router.post("/update-product/:id", verifyToken, updateProduct);
router.post("/delete-product/:id", verifyToken, deleteProduct);
router.get("/stock-managment", verifyToken, StockManagmentPage);
router.post("/product/update-stock", updateStockManagment);

module.exports = router;
