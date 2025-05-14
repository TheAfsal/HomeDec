const express = require("express");
const {
  loginAdmin,
  listUsers,
  toggleUserStatus,
  addCategory,
  listCategory,
  addSeller,
  listSellers,
  toggleCategoryStatus,
  editCategory,
  listOrders,
  createCoupon,
  getAllCoupons,
  updateCoupon,
  toggleCouponStatus,
  createOffer,
  getAllOffers,
  toggleOfferStatus,
  updateOffer,
  fetchSalesReport,
  fetchProductsforAdmin,
  getNumberOfUsers,
  bestSellingProduct,
  findTop10,
} = require("../controllers/adminController");
const {
  verifyRoleToken,
  verifyTokenAdmin,
} = require("../middleware/authAdminMiddleware");
const router = express.Router();

router.post("/login", loginAdmin);

router.get("/users/list", verifyTokenAdmin, listUsers);

router.patch(
  "/users/toggle-status/:userId",
  verifyTokenAdmin,
  toggleUserStatus
);

//Category
router.get("/category/list", verifyTokenAdmin, listCategory);

router.post("/category/add", verifyTokenAdmin, addCategory);

router.put("/category/edit", verifyTokenAdmin, editCategory);

router.patch(
  "/category/toggle-status/:catId",
  verifyTokenAdmin,
  toggleCategoryStatus
);

//Seller
router.get("/seller/list", verifyTokenAdmin, listSellers);

router.post("/seller/add", verifyTokenAdmin, addSeller);

//Role
router.get("/role", verifyRoleToken);

//Orders
router.get("/orders/list", verifyTokenAdmin, listOrders);

// Coupon
router.post("/coupons/create", verifyTokenAdmin, createCoupon);

router.get("/coupons", verifyTokenAdmin, getAllCoupons);

router.put("/coupons/update", verifyTokenAdmin, updateCoupon);

router.patch(
  "/coupons/toggle-status/:id",
  verifyTokenAdmin,
  toggleCouponStatus
);

// Offers
router.post("/offers/create", verifyTokenAdmin, createOffer);

router.get("/offers", verifyTokenAdmin, getAllOffers);

router.put("/offers/update", verifyTokenAdmin, updateOffer);

router.patch("/offers/toggle-status/:id", verifyTokenAdmin, toggleOfferStatus);

//Sales Report
router.get("/sales-report", verifyTokenAdmin, fetchSalesReport);

//Products
router.get("/products/list", verifyTokenAdmin, fetchProductsforAdmin);

//List number of users
router.get("/get-user-count", verifyTokenAdmin, getNumberOfUsers);

//Best selling product
router.get("/top-10", verifyTokenAdmin, findTop10);

module.exports = router;
