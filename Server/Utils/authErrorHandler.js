// utils/errorHandler.js
module.exports = {
  handleLoginError: (error, res) => {
    switch (error.message) {
      case "Invalid credentials":
        return res.status(401).json({ error: error.message });

      case "Incorrect password":
        return res.status(401).json({ error: error.message });

      case "User does not exist":
        return res.status(401).json({ error: error.message });

      case "Account blocked":
        return res.status(401).json({ error: error.message });

      default:
        console.error("Error during login:", error);
        return res
          .status(500)
          .json({ error: "An error occurred during login" });
    }
  },
};
