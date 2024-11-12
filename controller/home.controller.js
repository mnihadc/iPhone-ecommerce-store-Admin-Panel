const getHomePage = (req, res, next) => {
  res.render("Home", {
    title: "Home page",
    isHomePage: true,
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
      res.redirect("/");
    } else {
      return res.status(404).send("Invalid email or password");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { getHomePage, getLoginPage, Login };
