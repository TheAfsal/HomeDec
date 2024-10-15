const express = require("express");
const userController = require("../controllers/userController");
const verifyToken = require("../middleware/authMiddleware");
const router = express.Router();
const multer = require("multer");
const { updateOrderStatus } = require("../controllers/sellerController");

const storage = multer.memoryStorage(); // Change to memory storage
const upload = multer({ storage: storage });

//Role
router.get("/verify-me", verifyToken, userController.userVerified);

router.post("/register", userController.createUser);

router.post("/verify-email", userController.verifyEmail);

router.post("/login", userController.loginUser);

router.get("/product/details/:id", userController.fetchProductDetails);

router.get("/products/list", userController.fetchProducts);

router.get("/cart/list", verifyToken, userController.fetchMyCart);

router.put("/cart/add-product", verifyToken, userController.addToCart);

//Promo code
router.post("/cart/validate-promo-code", verifyToken, userController.validatePromoCodeController);

router.post(
  "/cart/checkout/create-new-order",
  verifyToken,
  userController.placeNewOrder
);

router.post(
  "/cart/checkout/update-existing-order",
  verifyToken,
  userController.updateExistingOrder
);

router.post(
  "/cart/checkout/add-transaction-id",
  verifyToken,
  userController.addTransactionId
);

router.patch(
  "/cart/remove-product",
  verifyToken,
  userController.removeFromCart
);

router.get("/account/profile", verifyToken, userController.fetchProfileDetails);

router.post(
  "/account/profile/edit-basic-details",
  verifyToken,
  upload.any(),
  userController.updateBasicDetails
);

router.patch(
  "/account/profile/edit-contact-details",
  verifyToken,
  userController.updateContactDetails
);

router.patch(
  "/account/profile/change-password",
  verifyToken,
  userController.changePassword
);

router.get("/account/address/list", verifyToken, userController.fetchAddresses);

router.put("/account/address/add-new", verifyToken, userController.addAdress);

router.delete(
  "/account/address/delete/:id",
  verifyToken,
  userController.removeAdress
);

router.get("/account/orders/list", verifyToken, userController.fetchUserOrders);

router.get(
  "/account/orders/details/:orderId",
  verifyToken,
  userController.fetchOrderDetail
);

router.patch("/orders/update-status", verifyToken, updateOrderStatus);

router.get("/products/search", userController.searchProduct);

router.get("/account/wishlist", verifyToken, userController.fetchWishList);

router.put(
  "/account/wishlist/add-product",
  verifyToken,
  userController.AddToWishList
);

router.patch(
  "/account/wishlist/remove-product",
  verifyToken,
  userController.removeFromWishList
);

router.put(
  "/account/wishlist/add-to-cart",
  verifyToken,
  userController.addMultipleItemsToCart
);

//Category
router.get("/category/list", userController.listCategory);


module.exports = router;
