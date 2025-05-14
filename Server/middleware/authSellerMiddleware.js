const jwt = require("jsonwebtoken");

const verifyTokenSeller = (req, res, next) => {
  const token = req.headers["authorization"].split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied. No token provided." });
  }

  try {
    const secretKey = process.env.JWT_SECRET_SELLER;
    const decoded = jwt.verify(token, secretKey);

    if (!decoded.admin) {
      req.user = decoded;
      next();
    } else {
      res.status(400).json({ message: "Invalid request" });
    }
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};

module.exports = verifyTokenSeller;
