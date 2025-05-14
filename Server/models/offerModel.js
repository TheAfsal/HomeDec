const mongoose = require("mongoose");
const { Schema } = mongoose;

const offerSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  discountType: {
    type: String,
    required: true,
    enum: ["percentage", "fixed"],
  },
  discountValue: {
    type: Number,
    required: true,
  },
  minPurchaseAmount: {
    type: Number,
    default: 0,
  },
  maxDiscountAmount: {
    type: Number,
    default: null,
  },
  startDate: {
    type: Date,
    required: true,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  usageLimit: {
    type: Number,
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  products: {
    type: Map, // Using a Map to store key-value pairs
    of: String, // Value will be a string (product name)
  },
  categories: {
    type: Map, // Using a Map to store key-value pairs
    of: String, // Value will be a string (category name)
  },
});

// Middleware to update `updatedAt` field automatically before saving
offerSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Method to check if the offer is valid
offerSchema.methods.isValid = function () {
  const currentDate = new Date();
  return (
    this.isActive &&
    currentDate >= this.startDate &&
    currentDate <= this.expiryDate
  );
};

// Method to check if the offer has exceeded its usage limit
offerSchema.methods.isUsageLimitExceeded = function (totalUsage) {
  return this.usageLimit && totalUsage >= this.usageLimit;
};

// Method to check if a user has exceeded their usage limit
offerSchema.methods.isUserLimitExceeded = function (userUsageCount) {
  return userUsageCount >= this.userLimit;
};

module.exports = mongoose.model("Offer", offerSchema);
