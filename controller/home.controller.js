const getHomePage = (req, res, next) => {
  res.render("Home", {
    title: "Home page",
    isHomePage: true,
  });
};

module.exports = { getHomePage };
