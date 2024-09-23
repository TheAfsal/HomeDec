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

// Middleware to serve static files
// app.use(express.static(path.join(__dirname, "public")));

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


// app.use(express.static(path.join(__dirname, "./dist")));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "./dist/index.html"));
// });

//Listenin on the port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
