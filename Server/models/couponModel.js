const mongoose = require('mongoose');
const { Schema } = mongoose;

const couponSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true, 
    trim: true,
  },
  discountType: {
    type: String,
    required: true,
    enum: ['percentage', 'fixed'], 
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
  expiryDate: {
    type: Date,
    required: true,
  },
  usageLimit: {
    type: Number,
    default: null,
  },
  userLimit: {
    type: Number,
    default: 1, 
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
});
    
// Middleware to update `updatedAt` field automatically before saving
couponSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Method to check if the coupon is valid
couponSchema.methods.isValid = function () {
  const currentDate = new Date();
  return this.isActive && currentDate <= this.expiryDate;
};

// Method to check if the coupon has exceeded its usage limit
couponSchema.methods.isUsageLimitExceeded = function (totalUsage) {
  if (this.usageLimit && totalUsage >= this.usageLimit) {
    return true;
  }
  return false;
};

// Method to check if a user has exceeded their usage limit
couponSchema.methods.isUserLimitExceeded = function (userUsageCount) {
  if (userUsageCount >= this.userLimit) {
    return true;
  }
  return false;
};

module.exports = mongoose.model('Coupon', couponSchema);
