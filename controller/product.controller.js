const getCreateProductPage = (req, res, next) => {
  res.render("Create-Product", {
    title: "Add-Product",
    isProductPage: true,
  });
};

module.exports = { getCreateProductPage };
