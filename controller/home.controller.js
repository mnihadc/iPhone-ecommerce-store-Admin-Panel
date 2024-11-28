const jwt = require("jsonwebtoken");
const User = require("../model/User");
const Product = require("../model/Product");
const Checkout = require("../model/Checkout");

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

const getSettingsPage = (req, res, next) => {
  res.render("Settings", { title: "Settings page" });
};
module.exports = { getHomePage, getSettingsPage };
