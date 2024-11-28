const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Admin = require("../model/Admin");

const Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const emailLowerCase = email.toLowerCase();

    const admin = await Admin.findOne({ email: emailLowerCase });

    if (!admin) {
      return res.status(400).send("Invalid email");
    }
    const isPasswordMatch = await bcrypt.compare(password, admin.password);

    if (!isPasswordMatch) {
      return res.status(400).send("Invalid password");
    }

    const token = jwt.sign(
      { email: admin.email, id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000,
    });

    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const getLoginPage = (req, res, next) => {
  res.render("Login", {
    title: "Login page",
    isLoginPage: true,
  });
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
const getNewAdminPage = (req, res, next) => {
  res.render("CreateNewUser", { title: "Create new admin" });
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
      role: role,
      profileImage: profileImage,
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
