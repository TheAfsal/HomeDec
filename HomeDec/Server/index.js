const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./database/dbConfig");

const PORT = 3000;

const userRouters = require("./Routers/userRouter");
const adminRouters = require("./Routers/adminRouters");
const sellerRouters = require("./Routers/sellerRouters");

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");

const GOOGLE_CLIENT_ID =
  "892370541918-nbul51f85oii3gkg08k7esdau84ni4an.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

const cookieSession = require("cookie-session");
const { createUser } = require("./services/authServices");
const userModel = require("./models/userModel");
const generateToken = require("./Utils/jwt");

// Middleware for cookie sessions
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.JWT_SECRET_USER],
  })
);

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
      console.log("profile");
      console.log(profile);
      console.log(profile.displayName);
      console.log(profile.name.familyName);
      console.log(profile.name.givenName);
      console.log(profile.emails[0].value);
      console.log(profile.photos[0].value);

      await createUser({
        firstName: profile.name.familyName,
        lastName: profile.name.givenName,
        email: profile.emails[0].value,
        password: "123456",
      });
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
    console.log(req.user);

    const userDetails = await userModel.find({
      email: req.user.emails[0].value,
    });

    console.log("______________________");
    console.log(userDetails[0]);

    const token = await generateToken(
      {
        _id: userDetails[0]._id,
        email: userDetails[0].email,
        cartId: userDetails[0].cartId,
        addressId: userDetails[0].addressId,
      },
      false,
      true
    );

    // Return the token to the client
    // res.json({ token });
    res.redirect(`http://localhost:5173/auth/google/${token}`);
  }
);

// Middleware to authenticate JWT
// const authenticateJWT = (req, res, next) => {
//   const token =
//     req.cookies["session"] || req.header("Authorization")?.split(" ")[1];

//   if (token) {
//     jwt.verify(token, process.env.JWT_SECRET_USER, (err, user) => {
//       if (err) {
//         return res.sendStatus(403);
//       }
//       req.user = user;
//       next();
//     });
//   } else {
//     res.sendStatus(401);
//   }
// };

// Protected route
// app.get("/profile", authenticateJWT, (req, res) => {
//   res.json(req.user);
// });

// Body parser middleware to parse form data
app.use(express.urlencoded({ extended: true }));

//Connect to DB
connectDB();

//setting Cors policy
app.use(
  cors({
    origin: "*",
  })
);

// parsing data
app.use(express.json());

// Routes Handling
app.use("/", userRouters);
app.use("/admin", adminRouters);
app.use("/seller", sellerRouters);
// app.use((err, req, res, next) => {
//   console.log(err.field);
//   console.log(err);
//   next();
// });

app.use(express.static(path.join(__dirname, "./dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./dist/index.html"));
});

//Listenin on the port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
