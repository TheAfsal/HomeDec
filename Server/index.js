const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const cookie = require("cookie-parser");
const dotenv = require("dotenv");
const config = require("config");
const port = config.get("port");
const HOST_URI = config.get("host");

const { connectDB } = require("./database/dbConfig");

dotenv.config();

const userRouters = require("./Routers/userRouter");
const adminRouters = require("./Routers/adminRouters");
const sellerRouters = require("./Routers/sellerRouters");

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const GOOGLE_CLIENT_ID =
  "892370541918-nbul51f85oii3gkg08k7esdau84ni4an.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

const cookieSession = require("cookie-session");
const { createUser } = require("./services/authServices");
const userModel = require("./models/userModel");
const generateToken = require("./Utils/jwt");
const mongoose  = require("mongoose");

//Connect to DB
connectDB();

if (process.env.NODE_ENV === "development") {
  mongoose.set('debug', true)
} else if (process.env.NODE_ENV === "production") {
}

app.use(cookie());

// Middleware for cookie sessions
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.JWT_SECRET_USER],
  })
)

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      // In a real application, you would want to find or create a user in your database here

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

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Routes
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    // Create JWT token

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

    res.redirect(`${process.env.SERVER_URL}/auth/google/${token}`);
  }
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use((req, res, next) => {
  console.log(req.url);
  next();
});

// Routes Handling
app.use("/", userRouters);
app.use("/admin", adminRouters);
app.use("/seller", sellerRouters);

app.use(express.static(path.join(__dirname, "./uploads")));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

