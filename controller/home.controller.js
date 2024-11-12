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
module.exports = { getHomePage, getLoginPage };
