const { addProductImages } = require("../middleware/uploadProductImages");
const Product = require("../models/productModel");
const authServices = require("../services/authServices");
const categoryServices = require("../services/categoryServices");
const inventoryServices = require("../services/inventoryServices");
const orderService = require("../services/orderService");
const productServices = require("../services/productServices");
const sellerServices = require("../services/sellerServices");
const { handleLoginError } = require("../Utils/authErrorHandler");
const { getBucket } = require("../database/dbConfig");
const fs = require("fs");

module.exports = {
  loginSeller: async (req, res) => {
    const { email, password } = req.body;

    try {
      const result = await authServices.loginSeller({ email, password });
      res.status(200).json(result);
    } catch (error) {
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
      const result = await categoryServices.listCategory("name");

      return res.status(200).json(result);
    } catch (error) {
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
  addProductImage: async (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const { buffer } = req.files[0];

    try {
      const bucket = getBucket();

      const uploadStream = bucket.openUploadStream(`${req.body.filename}.png`);

      uploadStream.end(buffer, (err) => {
        if (err) {
          console.error("Error uploading buffer:", err);
        } else {
        }
      });
    } catch (error) {
      console.error("Error during file upload:", error);
    }

    // const writestream = gfs.createWriteStream({
    //   filename: originalname,
    //   contentType: mimetype,
    //   metadata: { productId: req.params.id }, // Optionally link to product ID
    // });

    // writestream.on("close", (file) => {
    //   res.status(200).json({
    //     message: "Image uploaded successfully",
    //     fileId: file._id,
    //     filename: file.filename,
    //   });
    // });

    // writestream.on("error", (err) => {
    //   console.error("Error writing to GridFS:", err);
    //   return res.status(500).json({ message: "Error uploading image" });
    // });

    // writestream.write(buffer);
    // writestream.end();
  },

  addNewProduct: async (req, res) => {
    const sellerId = req.user._id;
    try {
      const result = await productServices.addProduct(req.body, sellerId);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(error.statusCode || 500).json({ error: error.message });
    }
  },

  editProduct: async (req, res) => {
    const sellerId = req.user._id;
    const prodId = req.body.prodId;

    try {
      const result = await productServices.editProduct(
        req.body.details,
        prodId,
        sellerId
      );
      return res.status(200).json(result);
    } catch (error) {
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

    // try {
    //   const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
    //     new: true,
    //     runValidators: true,
    //   });

    //   if (!updatedProduct) {
    //     return { success: false, message: "Product not found" };
    //   }

    //   return { success: true, data: updatedProduct };
    // } catch (error) {
    //   console.error("Error updating product:", error);
    //   return { success: false, message: error.message };
    // }
  },

  updateProduct: async (req, res) => {
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
    const productId = req.body.id;

    try {
      let uploadedImages = [];

      // Check if files were uploaded
      if (req.files && req.files.length > 0) {
        uploadedImages = await addProductImages(req.files, variants.length);
      }

      // Prepare product data for update
      const updateData = {
        category,
        subCategory,
        title,
        description,
        deliveryCondition,
        warranty,
        relatedKeywords,
        itemProperties,
        sellerId,
        variants: variants.map((variant, index) => ({
          ...variant,
          images: uploadedImages[index] || variant.images,
        })),
      };

      // Update the product in the database
      const result = await productServices.updateProduct(productId, updateData);

      return res.status(200).json(result);
    } catch (error) {
      return res.status(error.statusCode || 500).json({ error: error.message });
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
      const result = await orderService.changeOrderStatus(
        status,
        orderId,
        productId,
        variantId
      );
      return res.status(200).json(result);
    } catch (error) {
      return res.status(error.status).json({ error: error.message });
    }
  },

  rejectCancelOrReturn: async (req, res) => {
    try {
      const { orderId, productId, variantId } = req.body;
      const result = await orderService.rejectCancelOrReturn(
        orderId,
        productId,
        variantId
      );
      return res.status(200).json(result);
    } catch (error) {
      return res.status(error.status).json({ error: error.message });
    }
  },

  fetchSalesReportForSeller: async (req, res) => {
    try {
      const { tf, sd, ed } = req.query;
      const { _id } = req.user;

      const offers = await inventoryServices.fetchSalesReportForSeller(
        _id,
        tf,
        sd,
        ed
      );
      return res.status(200).json(offers);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};
