const mongoose = require("mongoose");

const walletTransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    transactionDate: {
      type: Date,
      default: Date.now, 
    },
    amount: {
      type: Number,
      required: true,
      min: 0, 
    },
    transactionType: {
      type: String,
      enum: ["debit", "credit"],
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WalletTransaction", walletTransactionSchema,"WalletTransactions");
