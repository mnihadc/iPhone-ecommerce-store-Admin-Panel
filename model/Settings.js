const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    firstBannerImageURL: {
      type: String,
      required: true,
      default: "https://images2.alphacoders.com/365/thumb-1920-36582.jpg",
    },
  },
  { timestamps: true }
);

const Settings = mongoose.model("Settings", settingsSchema);

module.exports = Settings;
