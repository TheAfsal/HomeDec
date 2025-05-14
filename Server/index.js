const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const config = require("config");
const port = config.get("port");

const { connectDB } = require("./database/dbConfig");

dotenv.config();

const userRouters = require("./Routers/userRouter");
const adminRouters = require("./Routers/adminRouters");
const sellerRouters = require("./Routers/sellerRouters");
const authRouters = require("./Routers/authRoutes");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

connectDB();

app.use("/", userRouters);
app.use("/admin", adminRouters);
app.use("/seller", sellerRouters);
app.use("/auth", authRouters);

app.use(express.static(path.join(__dirname, "./uploads")));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
 