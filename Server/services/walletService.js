const User = require("../models/userModel");
const Wallet = require("../models/walletTransaction");

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

  getWalletDetails: async (userId) => {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      const transactions = await Wallet.find({
        userId: user._id,
      }).sort({ transactionDate: -1 });

      return {
        walletBalance: user.walletBalance,
        transactions,
      };
    } catch (error) {
      throw new Error(`Error fetching wallet details: ${error.message}`);
    }
  },
};
