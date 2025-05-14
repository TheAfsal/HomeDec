const jwt = require("jsonwebtoken");

const generateToken = (payload, isAdmin = false, isUser = false) => {
  const jwt_secret = isUser
    ? process.env.JWT_SECRET_USER
    : isAdmin
    ? process.env.JWT_SECRET_ADMIN
    : process.env.JWT_SECRET_SELLER;

  isUser ? null : (payload.admin = isAdmin);

  const token = jwt.sign(payload, jwt_secret, { expiresIn: "10h" });
  return token;
};

module.exports = generateToken;
