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
  updateProduct,
  fetchSalesReportForSeller,
  rejectCancelOrReturn,
  addProductImage,
  editProduct,
} = require("../controllers/sellerController");
const router = express.Router();

const multer = require("multer");
const cloudinary = require("../database/cloudinaryConfig");
const Product = require("../models/productModel");
const verifyTokenSeller = require("../middleware/authSellerMiddleware");
const {
  getAllCoupons,
  getNumberOfUsers,
} = require("../controllers/adminController");
const saveTempProductImage = require("../middleware/multerSingleUpload");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//
router.post("/login", loginSeller);

router.post("/products/add", verifyTokenSeller, addNewProduct);

router.post("/products/edit", verifyTokenSeller, editProduct);

// router.post("/products/edit", verifyTokenSeller, upload.any(), EditNewProduct);

// router.post(
//   "/products/add-product-image/:id",
//   verifyTokenSeller,
//   saveTempProductImage.single("image"),
//   addProductImage
// );

router.post(
  "/products/add-product-image",
  verifyTokenSeller,
  upload.any(),
  addProductImage
);

router.post("/products/edit", verifyTokenSeller, upload.any(), updateProduct);

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

router.patch(
  "/orders/reject-cancel-or-return",
  verifyTokenSeller,
  rejectCancelOrReturn
);

// Coupon
router.get("/coupons", verifyTokenSeller, getAllCoupons);

//Sales Report
router.get("/sales-report", verifyTokenSeller, fetchSalesReportForSeller);

//List number of users
router.get("/get-user-count", verifyTokenSeller, getNumberOfUsers);

// no need
async function deleteImageFromCloudinary(req, res) {
  const { publicId } = req.body;

  if (!publicId) {
    return res.status(400).send({ error: "Public ID is required" });
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    // Log the result to see if the deletion was successful

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
