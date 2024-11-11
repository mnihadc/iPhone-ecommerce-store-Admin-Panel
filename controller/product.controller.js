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
      colorImages, // Get color images URLs directly from the form
    } = req.body;

    // Process color options
    const colorOptions = colorName.map((name, index) => ({
      colorName: name,
      colorCode: colorCode[index],
      colorImage: colorImages[index] || "", // Directly use the URL from the form
    }));

    // Process product images (URLs)
    const productImages = req.body.productImages || []; // Assuming productImages[] are URLs as well

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
    res
      .status(201)
      .json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    next(error); // Handle error properly
  }
};

module.exports = { getCreateProductPage, CreateProduct };
