const Product = require("../models/productModel");
const Sellers = require("../models/sellerModel");

module.exports = {
  listSellers: async () => {
    try {
      const sellerList = await Sellers.find()
      return sellerList;
    } catch (error) {
      throw new Error("Failed to fetch sellers");
    }
  },

  listProducts: async () => {
    try {
      const products = await Product.find()
      return products;
    } catch (error) {
      throw new Error("Failed to fetch sellers");
    }
  },


};
