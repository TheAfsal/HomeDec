const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order", 
    },
    transactionId: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
      min: 0, 
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed"], 
      default: "Pending",
    },
    paymentDate: {
      type: Date,
      default: Date.now, 
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
