const jwt = require("jsonwebtoken");
const Admin = require("../model/Admin");
const bcrypt = require("bcryptjs");
const getLoginPage = (req, res, next) => {
  res.render("Login", {
    title: "Login page",
    isLoginPage: true,
  });
};
const getNewAdminPage = (req, res, next) => {
  res.render("CreateNewUser", {
    title: "Create New Admin",
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

    res.redirect("/auth/get-login");
  } catch (error) {
    next(error);
  }
};

const createNewAdmin = async (req, res, next) => {
  try {
    const { username, email, password, role, profileImage } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ message: "Admin with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      username,
      email,
      password: hashedPassword,
      role: role || "Admin",
      profileImage:
        profileImage ||
        "https://www.pngmart.com/files/21/Admin-Profile-Vector-PNG-Image.png",
    });

    await newAdmin.save();

    res.redirect("/settings");
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error creating admin. Please try again." });
  }
};

module.exports = {
  getLoginPage,
  Login,
  Logout,
  getNewAdminPage,
  createNewAdmin,
};
