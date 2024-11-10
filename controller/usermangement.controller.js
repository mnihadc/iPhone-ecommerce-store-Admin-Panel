const User = require("../model/User");

const getUserMangementPage = async (req, res) => {
  try {
    const users = await User.find({});
    res.render("UserManagement", {
      title: "User Management",
      isUserManagementPage: true,
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("An error occurred");
  }
};

module.exports = getUserMangementPage;
