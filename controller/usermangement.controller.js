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
const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const result = await User.findByIdAndDelete(userId);

    if (result) {
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send("An error occurred");
  }
};

module.exports = { getUserMangementPage, deleteUser };
