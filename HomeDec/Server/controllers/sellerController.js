const { addProductImages } = require("../middleware/uploadProductImages");
const Product = require("../models/productModel");
const authServices = require("../services/authServices");
const categoryServices = require("../services/categoryServices");
const orderService = require("../services/orderService");
const productServices = require("../services/productServices");
const sellerServices = require("../services/sellerServices");
const { handleLoginError } = require("../Utils/authErrorHandler");

module.exports = {
  loginSeller: async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);

    try {
      const result = await authServices.loginSeller({ email, password });
      res.status(200).json(result);
    } catch (error) {
      console.log(error);

      handleLoginError(error, res);
    }
  },

  // Fetch products
  fetchProducts: async (req, res) => {
    try {
      const result = await productServices.listProducts(req.user._id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch products" });
    }
  },

  // list products
  listCategory: async (req, res) => {
    try {
      console.log("hi");

      const result = await categoryServices.listCategory("name");
      console.log(result);

      return res.status(200).json(result);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Failed to fetch categories" });
    }
  },

  // Toggle products
  toggleProductStatus: async (req, res) => {
    const { productId, variantId } = req.params;

    try {
      const result = await productServices.toggleVariantStatus(
        productId,
        variantId
      );
      return res.status(200).json(result);
    } catch (error) {
      console.log(error);
      if (
        error.message === ("Product not found" || "Failed to update product")
      ) {
        return res.status(404).json({ error: error.message });
      } else if (error.message === "Variant index out of bounds") {
        return res.status(400).json({ error: error.message });
      } else {
        return res
          .status(500)
          .json({ error: "Error toggling category status" });
      }
    }
  },

  // add new products
  addNewProduct: async (req, res) => {
    const {
      category,
      subCategory,
      title,
      description,
      deliveryCondition,
      warranty,
      relatedKeywords,
      itemProperties,
      variants,
    } = req.body;

    const sellerId = req.user._id;

    console.log(
      category,
      subCategory,
      title,
      description,
      deliveryCondition,
      warranty,
      relatedKeywords,
      itemProperties,
      variants,
      // uploadedImages,
      sellerId
    );

    try {
      const uploadedImages = await addProductImages(req.files, variants.length);
      const result = await productServices.addProduct(
        category,
        subCategory,
        title,
        description,
        deliveryCondition,
        warranty,
        relatedKeywords,
        itemProperties,
        variants,
        uploadedImages,
        sellerId
      );
      return res.status(200).json(result);
    } catch (error) {
      console.log(error);

      return res.status(error.statusCode || 500).json({ error: error.message });
    }
  },

  EditNewProduct: async (req, res) => {
    const {
      category,
      subCategory,
      title,
      description,
      deliveryCondition,
      warranty,
      relatedKeywords,
      itemProperties,
      variants,
      id,
    } = req.body;

    // const sellerId = req.user._id;

    console.log(req.body);

    try {
      const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!updatedProduct) {
        return { success: false, message: "Product not found" };
      }

      return { success: true, data: updatedProduct };
    } catch (error) {
      console.error("Error updating product:", error);
      return { success: false, message: error.message };
    }
  },

  listOrders: async (req, res) => {
    try {
      const { _id } = req.user;
      const result = await orderService.ListOrdersForSeller(_id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch Orders" });
    }
  },

  updateOrderStatus: async (req, res) => {
    try {
      const { status, orderId, productId, variantId } = req.body;
      const result = await orderService.changeOrderStatus(status, orderId, productId, variantId);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(error.status).json({ error: error.message });
    }
  },
};
