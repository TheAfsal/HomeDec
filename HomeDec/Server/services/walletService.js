const User = require("../models/userModel");

module.exports = {
  getCurrentWalletBalance: async (userId) => {
    try {
      const user = await User.findById(userId).select("walletBalance"); 
      if (!user) {
        throw new Error("User not found");
      }
      return user.walletBalance;
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
      throw error; 
    }
  },
};
