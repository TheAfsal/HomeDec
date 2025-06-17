const express = require("express");
const passport = require("passport");
const { createUser } = require("../services/authServices");
const userModel = require("../models/userModel");
const generateToken = require("../Utils/jwt");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const router = express.Router();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        await createUser({
          firstName: profile.name.familyName,
          lastName: profile.name.givenName,
          email: profile.emails[0].value,
          password: "123456", 
        });
      } catch (error) {
        console.log("OAuth user creation error:", error.message);
      }
      return done(null, profile);
    }
  )
);

// Step 1: Redirect user to Google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Step 2: Google callback hits this route
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    try {
      const userDetails = await userModel.findOne({
        email: req.user.emails[0].value,
      });

      const token = generateToken(
        {
          _id: userDetails._id,
          email: userDetails.email,
          cartId: userDetails.cartId,
          addressId: userDetails.addressId,
          wishlistId: userDetails.wishlistId,
        },
        false,
        true
      );

      // Redirect back to the frontend with the token
      res.redirect(`${process.env.FRONTEND_URL}/auth/google/callback?token=${token}`);
    } catch (error) {
      console.log("Callback error:", error.message);
      res.redirect(`${process.env.FRONTEND_URL}/auth/google/callback?error=oauth_failed`);
    }
  }
);

module.exports = router;
