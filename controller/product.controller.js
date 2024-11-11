const Product = require("../model/Product");

const getCreateProductPage = (req, res, next) => {
  res.render("Create-Product", { title: "Add-Product", isProductPage: true });
};

const CreateProduct = async (req, res, next) => {
  try {
    const {
      name,
      category,
      description,
      price,
      offerPrice,
      stock,
      releaseDate,
      colorName,
      colorCode,
      specifications,
      colorImages,
    } = req.body;

    const colorOptions = colorName.map((name, index) => ({
      colorName: name,
      colorCode: colorCode[index],
      colorImage: colorImages[index] || "",
    }));

    const productImages = req.body.productImages || [];

    const newProduct = new Product({
      name,
      category,
      description,
      price,
      offerPrice: offerPrice || null,
      stock,
      releaseDate,
      colorOptions,
      productImages,
      specifications,
    });

    await newProduct.save();
    res.redirect("/product/create-product");
  } catch (error) {
    next(error);
  }
};

module.exports = { getCreateProductPage, CreateProduct };
