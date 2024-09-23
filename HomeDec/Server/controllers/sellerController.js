const authServices = require("../services/authServices");
const sellerServices = require("../services/sellerServices");
const errorHandler = require("../Utils/errorHandler");

module.exports = {
  loginSeller: async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);

    try {
      const result = await authServices.loginSeller({ email, password });
      res.status(200).json(result);
    } catch (error) {
      console.log(error);

      errorHandler.handleLoginError(error, res);
    }
  },

  fetchProducts: async (req, res) => {
    try {
      const result = await sellerServices.listProducts();
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch products" });
    }
  },

};
