const Sellers = require("../models/sellerModel");

module.exports = {
  listSellers: async () => {
    try {
      const sellerList = await Sellers.find();
      return sellerList;
    } catch (error) {
      throw new Error("Failed to fetch sellers");
    }
  },
};
