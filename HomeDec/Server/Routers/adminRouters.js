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
} = require("../controllers/adminController");
const { verifyRoleToken, verifyTokenAdmin } = require("../middleware/authAdminMiddleware");
const router = express.Router();

router.post("/login", loginAdmin);

router.get("/users/list",verifyTokenAdmin, listUsers);

router.patch("/users/toggle-status/:userId",verifyTokenAdmin, toggleUserStatus);

//Category
router.get("/category/list",verifyTokenAdmin, listCategory);

router.post("/category/add",verifyTokenAdmin, addCategory);

router.put("/category/edit",verifyTokenAdmin, editCategory);

router.patch("/category/toggle-status/:catId",verifyTokenAdmin, toggleCategoryStatus);

//Seller
router.get("/seller/list",verifyTokenAdmin, listSellers);

router.post("/seller/add",verifyTokenAdmin, addSeller);

//Role
router.get("/role", verifyRoleToken);

//Orders
router.get("/orders/list", listOrders);



module.exports = router;
