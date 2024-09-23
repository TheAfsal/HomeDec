const express = require("express");
const {
  loginAdmin,
  listUsers,
  editUser,
  toggleUserStatus,
  addCategory,
  listCategory,
  addSeller,
  listSellers,
} = require("../controllers/adminController");
const verifyToken = require("../middleware/authAdminMiddleware");
const router = express.Router();

router.post("/login", loginAdmin);

router.get("/users/list", listUsers);

router.patch("/users/toggle-status/:userId", toggleUserStatus);

//Category
router.get("/category/list", listCategory);

router.post("/category/add", addCategory);

//Seller
router.get("/seller/list", listSellers);

router.post("/seller/add", addSeller);

//Role
router.get('/role', verifyToken.verifyRoleToken);



//////////////////////////////////////
// router.post("/edit-user", upload.single("image"), verifyToken, editUser);

// router.post("/add-user", async (req, res) => {
//   const { name, email, password } = req.body;
//   console.log(name, email, password);
//   try {
//     await createUser(name, email, password);
//     res.redirect("/admin");
//   } catch (error) {
//     console.log(error);
//   }
// });

// router.get("/search", async (req, res) => {
//   try {
//     const results = await searchKey(req.query.searchKey);
//     res.json(results);
//     // res.render('admin/home', { searchResults: results });
//   } catch (error) {
//     console.log(error);
//   }
// });

// router.get("/logout", (req, res) => {
//   // if (req.session.admin) {
//   //   delete req.session.admin;
//   // }
//   res.redirect("/admin/login");
//   // req.session.destroy((err) => {
//   //   if (err) {
//   //     return res.status(500).send("Error logging out");
//   //   }
//   //   res.redirect("/admin/login");
//   // });
// });

module.exports = router;
