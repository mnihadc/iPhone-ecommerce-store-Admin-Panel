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
      specifications, // array of strings like "Processor: A16 Bionic"
      colorImages,
    } = req.body;

    // Convert specifications array of strings into key-value objects
    const parsedSpecifications = specifications.map((spec) => {
      const [key, value] = spec.split(":").map((s) => s.trim());
      return { key, value };
    });

    const colorOptions = colorName.map((name, index) => ({
      colorName: name,
      colorCode: colorCode[index],
      colorImage: colorImages[index] || "", // If no image is provided, set an empty string
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
      specifications: parsedSpecifications,
    });

    await newProduct.save();
    res.redirect("/product/create-product");
  } catch (error) {
    console.error("Error creating product:", error);
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
    title: "Product-Management",
    isProductPage: true,
    products: productData,
  });
};

const editProductPage = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send("Product not found");
    }
    const categories = product.category;
    res.render("EditProduct", {
      title: "Edit Product",
      isProductPage: true,
      product,
      categories,
    });
  } catch (err) {
    next(err);
  }
};

const updateProduct = async (req, res, next) => {
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
      productImages,
    } = req.body;

    // Prepare color options array
    const colorOptions = colorName.map((name, index) => ({
      colorName: name,
      colorCode: colorCode[index],
      colorImage: colorImages[index] || "",
    }));

    const updatedData = {
      name,
      category,
      description,
      price,
      offerPrice,
      stock,
      releaseDate,
      colorOptions,
      productImages: productImages || [],
      specifications,
    };

    await Product.findByIdAndUpdate(req.params.id, updatedData);
    res.redirect("/product/get-product");
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).send("Product not found");
    }
    res.redirect("/product/get-product");
  } catch (error) {
    next(error);
  }
};
const StockManagmentPage = async (req, res, next) => {
  try {
    // Fetch products from the database
    const products = await Product.find({});

    // Transform the data to include only the required fields
    const transformedProducts = products.map((product) => ({
      _id: product._id,
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      image: product.productImages[0], // Get the first image
    }));

    // Pass the transformed data to the template
    res.render("StockManagment", {
      title: "Stock Management",
      products: transformedProducts,
    });
  } catch (error) {
    next(error);
  }
};

const updateStockManagment = async (req, res, next) => {
  try {
    const { productId, stock, price } = req.body; // Assuming you send stock and price via POST request

    // Find the product by its ID and update stock and price
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { stock, price },
      { new: true } // Return the updated document
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getCreateProductPage,
  CreateProduct,
  getProductPage,
  editProductPage,
  updateProduct,
  deleteProduct,
  StockManagmentPage,
  updateStockManagment,
};
