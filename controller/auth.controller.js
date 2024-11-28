const jwt = require("jsonwebtoken");

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

    res.redirect("/auth/get-login");
  } catch (error) {
    next(error);
  }
};

module.exports = { getLoginPage, Login, Logout };
