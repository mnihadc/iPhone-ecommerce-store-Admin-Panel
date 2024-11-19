const jwt = require("jsonwebtoken");
const User = require("../model/User");
const Product = require("../model/Product");
const Checkout = require("../model/Checkout");

const getHomePage = async (req, res, next) => {
  try {
    // Get total number of products and users
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();

    // Get current month and previous month date range
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

    // Get 48 hours ago timestamp
    const date48HoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000); // 48 hours in milliseconds

    // Get the total orders placed in the last 48 hours
    const totalOrders = await Checkout.countDocuments({
      createdAt: { $gte: date48HoursAgo }, // Orders created in the last 48 hours
    });

    // Get total sales for the current month
    const currentMonthSales = await Checkout.aggregate([
      { $match: { createdAt: { $gte: currentMonthStart } } },
      { $group: { _id: null, totalSales: { $sum: "$totalPrice" } } },
    ]);

    // Get total sales for the previous month
    const previousMonthSales = await Checkout.aggregate([
      {
        $match: {
          createdAt: { $gte: previousMonthStart, $lte: previousMonthEnd },
        },
      },
      { $group: { _id: null, totalSales: { $sum: "$totalPrice" } } },
    ]);

    // Calculate the total sales for each month
    const currentSales = currentMonthSales[0]?.totalSales || 0;
    const previousSales = previousMonthSales[0]?.totalSales || 0;

    // Calculate sales growth percentage
    let growth = 0;

    if (previousSales > 0) {
      // Normal growth calculation
      growth = ((currentSales - previousSales) / previousSales) * 100;
    } else if (previousSales === 0 && currentSales > 0) {
      // If there were no sales last month but there are sales this month
      growth = 100;
    }
    const salesData = await Checkout.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" }, // Group by month
          totalSales: { $sum: "$totalPrice" },
        },
      },
      {
        $sort: { _id: 1 }, // Sort by month
      },
    ]);

    // Prepare the sales data for the chart (fill in missing months if any)
    let monthlySales = Array(12).fill(0); // Initialize array for 12 months of data
    salesData.forEach((item) => {
      monthlySales[item._id - 1] = item.totalSales; // Map the sales to the correct month (0-11 index)
    });
    // Pass all the data to the view
    res.render("Home", {
      title: "Home page",
      isHomePage: true,
      totalUsers,
      totalProducts,
      totalOrders,
      monthlySales,
      salesGrowth: growth.toFixed(2), // Display sales growth as a percentage with two decimals
    });
  } catch (error) {
    next(error); // Handle any errors that occur
  }
};

const getLoginPage = (req, res, next) => {
  res.render("Login", {
    title: "Login page",
    isLoginPage: true,
  });
};
const Login = (req, res, next) => {
  try {
    const { email, password } = req.body;
    const emailData = process.env.email;
    const passwordData = process.env.password;

    if (emailData === email && passwordData === password) {
      const token = jwt.sign({ email: email }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.cookie("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600000,
      });
      res.redirect("/");
    } else {
      return res.send("Invalid email or password");
    }
  } catch (error) {
    next(error);
  }
};

const Logout = (req, res, next) => {
  try {
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.redirect("/get-login");
  } catch (error) {
    next(error);
  }
};

module.exports = { getHomePage, getLoginPage, Login, Logout };
