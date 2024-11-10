const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      "iPhone",
      "iPad",
      "MacBook",
      "Apple Watch",
      "AirPods",
      "Accessories",
    ],
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  offerPrice: {
    type: Number,
    min: 0,
    default: null,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
  colorOptions: [
    {
      colorName: String,
      colorCode: String,
      images: [String],
    },
  ],
  specifications: {
    processor: String,
    memory: String,
    storage: String,
    displaySize: String,
    camera: String,
    battery: String,
    connectivity: [String],
  },
  releaseDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Auto update 'updatedAt' on document update
productSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
