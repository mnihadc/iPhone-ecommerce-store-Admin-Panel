const getUserMangementPage = (req, res, next) => {
  res.render("UserManagement", {
    title: "User Management",
    isUserManagementPage: true,
  });
};
module.exports = getUserMangementPage;
