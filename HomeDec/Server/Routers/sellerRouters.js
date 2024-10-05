const express = require("express");
const {
  loginSeller,
  fetchProducts,
  toggleProductStatus,
  addNewProduct,
  listCategory,
  EditNewProduct,
  listOrders,
  updateOrderStatus,
} = require("../controllers/sellerController");
const router = express.Router();

const multer = require("multer");
const cloudinary = require("../database/cloudinaryConfig");
const Product = require("../models/productModel");
const verifyTokenSeller = require("../middleware/authSellerMiddleware");

router.post("/login", loginSeller);

const upload = multer({ dest: "./uploads/" });

router.post("/products/add", verifyTokenSeller, upload.any(), addNewProduct);

router.post("/products/edit", verifyTokenSeller, upload.any(), EditNewProduct);

router.get("/category/list", verifyTokenSeller, listCategory);

router.get("/products/list", verifyTokenSeller, fetchProducts);

router.patch(
  "/products/toggle-status/:productId/:variantId",
  verifyTokenSeller,
  toggleProductStatus
);

//Orders
router.get("/orders/list", verifyTokenSeller, listOrders);

router.patch("/orders/update-status", verifyTokenSeller, updateOrderStatus);


async function deleteImageFromCloudinary(req, res) {
  const { publicId } = req.body;

  if (!publicId) {
    return res.status(400).send({ error: "Public ID is required" });
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log(result); // Log the result to see if the deletion was successful

    if (result.result === "ok") {
      return res.status(200).send({ message: "Image deleted successfully" });
    } else {
      return res.status(500).send({ error: "Failed to delete image" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error deleting image" });
  }
}

module.exports = router;
