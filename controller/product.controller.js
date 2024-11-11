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

const getProductPage = async (req, res, next) => {
  const productData = await Product.find({});
  productData.forEach((product) => {
    if (product.releaseDate) {
      product.formattedReleaseDate = new Date(
        product.releaseDate
      ).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }
  });
  res.render("Product", {
    title: "Product Details",
    isProductPage: true,
    products: productData,
  });
};

module.exports = { getCreateProductPage, CreateProduct, getProductPage };
