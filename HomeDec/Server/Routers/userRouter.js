const express = require("express");
const router = express.Router();

const {
  createUser,
  loginUser,
  verifyEmail,
} = require("../controllers/userController");
const verifyToken = require("../middleware/authMiddleware");



router.post("/register", createUser);

router.post("/verify-email", verifyEmail);

router.post("/login", loginUser);

// unwanted from below
// router.get("/profile",verifyToken );

// router.post("/profile/update",verifyToken ,updateProfile);
















// Middleware to check if user is logged in
// function redirectToHomeIfLoggedIn(req, res, next) {
// if (req.session.user) {
//   return res.redirect("/");
// }
// next();
// }

router.get("/", async (req, res) => {
  // if (!req.session.user) {
  //   return res.redirect("/login");
  // }
  try {
    const details = await getMyData(req.session.user.email);
    res.render("user/home", { details });
  } catch (error) {
    return res.redirect("/login");
  }
});



router.get("/logout", (req, res) => {
  // if (req.session.user) {
  //   delete req.session.user;
  // }
  res.redirect("/login");
  // req.session.destroy((err) => {
  //   if (err) {
  //     return res.status(500).send("Error logging out");
  //   }
  //   res.redirect("/login");
  // });
});

module.exports = router;
