const jwt = require("jsonwebtoken");
const User = require("../model/User");
const Product = require("../model/Product");
const Checkout = require("../model/Checkout");
const Admin = require("../model/Admin");
const bcrypt = require("bcryptjs");
const Coupon = require("../model/Coupons");

const getHomePage = async (req, res, next) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();

    const currentMonthStart = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );

    const previousMonthStart = new Date(
      new Date().getFullYear(),
      new Date().getMonth() - 1,
      1
    );
    const previousMonthEnd = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      0
    );

    const date48HoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);

    const totalOrders = await Checkout.countDocuments({
      createdAt: { $gte: date48HoursAgo },
    });

    const currentMonthSales = await Checkout.aggregate([
      { $match: { createdAt: { $gte: currentMonthStart } } },
      { $group: { _id: null, totalSales: { $sum: "$totalPrice" } } },
    ]);

    const previousMonthSales = await Checkout.aggregate([
      {
        $match: {
          createdAt: { $gte: previousMonthStart, $lte: previousMonthEnd },
        },
      },
      { $group: { _id: null, totalSales: { $sum: "$totalPrice" } } },
    ]);
    const currentSales = currentMonthSales[0]?.totalSales || 0;
    const previousSales = previousMonthSales[0]?.totalSales || 0;

    let growth = 0;

    if (previousSales > 0) {
      growth = ((currentSales - previousSales) / previousSales) * 100;
    } else if (previousSales === 0 && currentSales > 0) {
      growth = 100;
    }
    const salesData = await Checkout.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalSales: { $sum: "$totalPrice" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    let monthlySales = Array(12).fill(0);
    salesData.forEach((item) => {
      monthlySales[item._id - 1] = item.totalSales;
    });

    res.render("Home", {
      title: "Home page",
      isHomePage: true,
      totalUsers,
      totalProducts,
      totalOrders,
      monthlySales,
      salesGrowth: growth.toFixed(2),
    });
  } catch (error) {
    next(error);
  }
};

const getSettingsPage = async (req, res, next) => {
  try {
    const adminId = req.user.id;
    const adminData = await Admin.findOne({ _id: adminId });

    if (!adminData) {
      return res.status(404).send("Admin not found");
    }

    let allAdmins = [];
    if (adminData.role === "Super Admin") {
      allAdmins = await Admin.find({});
    }

    const profileImage = adminData.profileImage || "/path/to/default-image.jpg";
    const bannerImage =
      adminData.firstPageBannerImageURL || "/path/to/default-image";
    const coupons = await Coupon.find({}).sort({ createdAt: -1 }); // Fetch coupons sorted by date

    res.render("Settings", {
      title: "Admin Settings",
      adminData,
      profileImage,
      bannerImage,
      allAdmins,
      coupons,
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { username, email, password, bannerImage } = req.body;
    const adminId = req.user.id;

    const updates = {
      username: username,
      email: email,
    };

    // Validate banner image URL
    if (bannerImage && !isValidURL(bannerImage)) {
      return res.status(400).json({ message: "Invalid banner image URL." });
    }

    // Update banner image if provided
    if (bannerImage) {
      updates.firstPageBannerImageURL = bannerImage;
    }

    // Hash password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password, salt);
    }

    // Update admin profile in the database
    await Admin.findByIdAndUpdate(adminId, updates, { new: true });

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update profile", error: error.message });
  }
};

// Helper function to validate the URL format
const isValidURL = (url) => {
  const regex = /^(ftp|http|https):\/\/[^ "]+$/;
  return regex.test(url);
};

module.exports = { getHomePage, getSettingsPage, updateProfile };
