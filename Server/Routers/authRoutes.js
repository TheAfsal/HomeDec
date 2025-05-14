const express = require("express");

const passport = require("passport");
const { createUser } = require("../services/authServices");
const userModel = require("../models/userModel");
const generateToken = require("../Utils/jwt");

const router = express.Router();

const GoogleStrategy = require("passport-google-oauth20").Strategy;

const GOOGLE_CLIENT_ID =
  "892370541918-nbul51f85oii3gkg08k7esdau84ni4an.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        await createUser({
          firstName: profile.name.familyName,
          lastName: profile.name.givenName,
          email: profile.emails[0].value,
          password: "123456",
        });
      } catch (error) {}

      return done(null, profile);
    }
  )
);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    const userDetails = await userModel.find({
      email: req.user.emails[0].value,
    });

    const token = generateToken(
      {
        _id: userDetails[0]._id,
        email: userDetails[0].email,
        cartId: userDetails[0].cartId,
        addressId: userDetails[0].addressId,
        wishlistId: userDetails[0].wishlistId,
      },
      false,
      true
    );

    res.redirect(`${process.env.FRONTEND_URL}/auth/google/${token}`);
  }
);

module.exports = router;
