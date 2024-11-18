const jwt = require("jsonwebtoken");

const verifyTokenAdmin = (req, res, next) => {
  const token = req.headers["authorization"].split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied. No token provided." });
  }

  try {
    const secretKey = process.env.JWT_SECRET_ADMIN;
    const decoded = jwt.verify(token, secretKey);

    if (decoded.admin) {
      next();
    } else {
      res.status(400).json({ message: "Invalid request" });
    }
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};

const verifyRoleToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(403).send("Token is required");
  }

  jwt.verify(token, process.env.JWT_SECRET_ADMIN, (err, decoded) => {
    if (decoded) {
      return res.status(200).json({ role: "admin" });
    }

    jwt.verify(token, process.env.JWT_SECRET_SELLER, (err, decoded) => {
      if (decoded) {
        return res.status(200).json({ role: "seller" });
      }

      return res.status(401).send("Invalid token");
    });
  });
};

module.exports = { verifyTokenAdmin, verifyRoleToken };
