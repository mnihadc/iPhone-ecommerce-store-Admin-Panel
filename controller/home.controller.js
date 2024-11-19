const jwt = require("jsonwebtoken");
const User = require("../model/User");
const Product = require("../model/Product");
const getHomePage = async (req, res, next) => {
  const totalUsers = await User.find().countDocuments();
  const totalProducts = await Product.find().countDocuments();
  res.render("Home", {
    title: "Home page",
    isHomePage: true,
    totalUsers,
    totalProducts,
  });
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
