const bcrypt = require("bcrypt");
const Admin = require("../models/adminModel");
const User = require("../models/userModel");
const adminServices = require("../services/adminServices");
const userService = require("../services/userService");
const authServices = require("../services/authServices");
const categoryServices = require("../services/categoryServices");
const sellerServices = require("../services/sellerServices");
const { handleLoginError } = require("../Utils/authErrorHandler");
const orderService = require("../services/orderService");

module.exports = {
  loginAdmin: async (req, res) => {
    const { email, password } = req.body;
    try {
      const result = await authServices.loginAdmin({ email, password });
      res.status(200).json(result);
    } catch (error) {
      handleLoginError(error, res);
    }
  },

  // Users Related
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

  // Category Related
  listCategory: async (req, res) => {
    try {
      const result = await categoryServices.listCategory(
        "name description isActive"
      );
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch categories" });
    }
  },
  // Category Add
  addCategory: async (req, res) => {
    const { newCategory, description, newSubCategory } = req.body;

    try {
      const result = await categoryServices.addCategory(
        newCategory,
        description,
        newSubCategory
      );
      return res.status(200).json(result);
    } catch (error) {
      console.log(error);

      return res.status(500).json({ error: "Error in creating new category" });
    }
  },

  // Toggle Category Status
  toggleCategoryStatus: async (req, res) => {
    const catId = req.params.catId;

    try {
      const result = await categoryServices.toggleCategoryStatus(catId);
      return res.status(200).json(result);
    } catch (error) {
      console.log(error);
      if (error.message) {
        return res.status(404).json({ error: error.message });
      } else {
        return res
          .status(500)
          .json({ error: "Error toggling category status" });
      }
    }
  },

  // edit Category
  editCategory: async (req, res) => {
    const { categoryName, categoryId, subCategoryName, subCategoryId } =
      req.body;

    try {
      const result = await categoryServices.editCategory(
        categoryName,
        categoryId,
        subCategoryName,
        subCategoryId
      );
      return res.status(200).json(result);
    } catch (error) {
      console.log(error);
      if (error.message) {
        return res.status(404).json({ error: error.message });
      } else {
        return res
          .status(500)
          .json({ error: "Error toggling category status" });
      }
    }
  },

  //Seller Related
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
      return res.status(error.statusCode || 500).json({ error: error.message });
    }
  },

  listOrders: async (req, res) => {
    try {
      const result = await orderService.ListOrdersForAdmin();
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch Orders" });
    }
  },
  
};
