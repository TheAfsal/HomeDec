const bcrypt = require("bcrypt");
const Admin = require("../models/adminModel");
const User = require("../models/userModel");
const adminServices = require("../services/adminServices");
const userService = require("../services/userService");
const authServices = require("../services/authServices");
const errorHandler = require("../Utils/errorHandler");
const categoryServices = require("../services/categoryServices");
const sellerServices = require("../services/sellerServices");

module.exports = {
  loginAdmin: async (req, res) => {
    const { email, password } = req.body;
    try {
      const result = await authServices.loginAdmin({ email, password });
      res.status(200).json(result);
    } catch (error) {
      errorHandler.handleLoginError(error, res);
    }
  },

  listUsers: async (req, res) => {
    try {
      const users = await adminServices.listUsers();
      return res.status(200).json(users);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "An error occurred while fetching users" });
    }
  },

  toggleUserStatus: async (req, res) => {
    const userId = req.params.userId;

    try {
      const result = await adminServices.toggleUserStatus(userId);
      return res.status(200).json(result);
    } catch (error) {
      console.log(error);

      if (error.message === "User not found") {
        return res.status(404).json({ error: error.message });
      } else {
        return res.status(500).json({ error: "Error toggling user status" });
      }
    }
  },

  listCategory: async (req, res) => {
    try {
      const result = await categoryServices.listCategory();
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch categories" });
    }
  },

  addCategory: async (req, res) => {
    const { newCategory, newSubCategory } = req.body;
    console.log(req.body);
    console.log(newCategory, newSubCategory);

    try {
      const result = await categoryServices.addCategory(
        newCategory,
        newSubCategory
      );
      return res.status(200).json(result);
    } catch (error) {
      console.log(error);

      return res.status(500).json({ error: "Error in creating new category" });
    }
  },

  listSellers: async (req, res) => {
    try {
      const result = await sellerServices.listSellers();
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch sellers" });
    }
  },

  addSeller: async (req, res) => {
    const {
      address,
      altContactNumber,
      businessName,
      commissionRate,
      confirmPassword,
      contactNumber,
      email,
      password,
      sellerName,
      taxId,
    } = req.body;

    try {
      const result = await authServices.createSeller({
        address,
        altContactNumber,
        businessName,
        commissionRate,
        confirmPassword,
        contactNumber,
        email,
        password,
        sellerName,
        taxId,
      });
      res.status(201).json(result);
    } catch (error) {
      console.log(error);

      if (error.code === 11000) {
        return res.status(400).json({ error: "Seller already exists" });
      } else {
        return res
          .status(500)
          .json({ error: "An error occurred during login" });
      }
    }
  },


  // unwnated below items
  editUser: async (req, res) => {
    console.log(req.file);
    try {
      const { name, email, id } = req.body;
      var image = "";
      if (req.file) {
        image = req.file.path;
      }
      const details = await userService.updateProfile(id, name, email, image);
      res.status(200).json(details);
    } catch (error) {
      if (error.message === "User does not exist") {
        return res.status(404).json({ error: error.message });
      } else {
        return res
          .status(500)
          .json({ message: "Failed to update profile", error: error.message });
      }
    }
  },

  addUser: async (name, email, password) => {
    return new Promise(async (resolve, reject) => {
      try {
        await User.save({ name, email, password });
        resolve();
      } catch (error) {
        if (error.code == 11000) {
          console.error("Email already in use");
          reject("Email already in use");
        } else {
          console.error("Error creating user:", error.message);
          reject("Error creating user");
        }
      }
    });
  },

  searchKey: async (searchKey) => {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await User.find({
          $or: [
            { name: { $regex: searchKey, $options: "i" } },
            { email: { $regex: searchKey, $options: "i" } },
          ],
        });
        resolve(result);
      } catch (error) {
        // if (error.code == 11000) {
        //   console.error("Email already in use");
        //   reject("Email already in use");
        // } else {
        console.error("Error creating user:", error.message);
        reject("Error searching user");
        // }
      }
    });
  },
};
