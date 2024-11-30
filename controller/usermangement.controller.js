const Address = require("../model/Address");
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

const getAddressManagementPage = async (req, res, next) => {
  try {
    const addresses = await Address.find().lean();

    // Format the created date in each address
    addresses.forEach((address) => {
      address.formattedCreatedAt = new Date(
        address.createdAt
      ).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    });

    res.render("Address-Mangement", {
      title: "Address Mangement",
      addresses: addresses,
    });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).send("An error occurred");
  }
};

const deleteAddress = async (req, res, next) => {
  try {
    const addressId = req.params.id;
    const result = await Address.findByIdAndDelete(addressId);
    if (result) {
      res.status(200).json({ message: "Address deleted successfully" });
    } else {
      res.status(404).json({ message: "Address not found" });
    }
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getUserMangementPage,
  deleteUser,
  getAddressManagementPage,
  deleteAddress,
};
