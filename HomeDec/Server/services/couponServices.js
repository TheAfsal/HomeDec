const Coupon = require("../models/couponModel");
const User = require("../models/userModel");

module.exports = {
  createCoupon: async (couponData) => {
    // Check if the coupon code is unique
    const existingCoupon = await Coupon.findOne({ code: couponData.code });
    if (existingCoupon) {
      throw { status: 400, message: "Coupon code already exists" };
    }

    // Validate discount type
    if (!["percentage", "fixed"].includes(couponData.discountType)) {
      throw {
        status: 400,
        message: 'Invalid discount type. It should be "percentage" or "fixed".',
      };
    }

    // Validate discount value
    if (couponData.discountType === "percentage") {
      if (couponData.discountValue <= 0 || couponData.discountValue > 100) {
        throw {
          status: 400,
          message: "Percentage discount value should be between 1 and 100.",
        };
      }
    } else if (couponData.discountType === "fixed") {
      if (couponData.discountValue <= 0) {
        throw {
          status: 400,
          message: "Fixed discount value should be greater than 0.",
        };
      }
    }

    // Validate minimum purchase amount
    if (
      couponData.minPurchaseAmount !== undefined &&
      couponData.minPurchaseAmount < 0
    ) {
      throw {
        status: 400,
        message: "Minimum purchase amount should be non-negative.",
      };
    }

    // Validate maximum discount amount
    if (
      couponData.maxDiscountAmount !== undefined &&
      couponData.maxDiscountAmount < 0
    ) {
      throw {
        status: 400,
        message: "Maximum discount amount should be non-negative.",
      };
    }

    // Validate that maximum discount is greater than or equal to the discount value (for fixed discounts)
    if (
      couponData.maxDiscountAmount !== undefined &&
      couponData.discountType === "fixed" &&
      couponData.maxDiscountAmount < couponData.discountValue
    ) {
      throw {
        status: 400,
        message:
          "Maximum discount amount must be greater than or equal to the fixed discount value.",
      };
    }

    // Validate expiry date (must be a future date)
    const currentDate = new Date();
    if (new Date(couponData.expiryDate) <= currentDate) {
      throw { status: 400, message: "Expiry date must be a future date." };
    }

    // Validate usage limit
    if (couponData.usageLimit !== undefined && couponData.usageLimit < 0) {
      throw { status: 400, message: "Usage limit should be non-negative." };
    }

    // Validate user limit
    if (couponData.userLimit < 0) {
      throw { status: 400, message: "User limit should be non-negative." };
    }

    // If all validations pass, create the coupon
    const coupon = new Coupon(couponData);
    return await coupon.save();
  },

  getAllCoupons: async () => {
    return await Coupon.find().sort({ expiryDate: 1 });
  },

  updateCoupon: async (couponId, couponData) => {
    // Find the existing coupon
    const existingCoupon = await Coupon.findById(couponId);
    if (!existingCoupon) {
      throw { status: 404, message: "Coupon not found." };
    }

    // Check if the coupon code is unique (but allow the same code if it's not changing)
    const duplicateCoupon = await Coupon.findOne({
      code: couponData.code,
      _id: { $ne: couponId },
    });
    if (duplicateCoupon) {
      throw { status: 400, message: "Coupon code already exists." };
    }

    // Validate discount type
    if (!["percentage", "fixed"].includes(couponData.discountType)) {
      throw {
        status: 400,
        message: 'Invalid discount type. It should be "percentage" or "fixed".',
      };
    }

    // Validate discount value
    if (couponData.discountType === "percentage") {
      if (couponData.discountValue <= 0 || couponData.discountValue > 100) {
        throw {
          status: 400,
          message: "Percentage discount value should be between 1 and 100.",
        };
      }
    } else if (couponData.discountType === "fixed") {
      if (couponData.discountValue <= 0) {
        throw {
          status: 400,
          message: "Fixed discount value should be greater than 0.",
        };
      }
    }

    // Validate minimum purchase amount
    if (
      couponData.minPurchaseAmount !== undefined &&
      couponData.minPurchaseAmount < 0
    ) {
      throw {
        status: 400,
        message: "Minimum purchase amount should be non-negative.",
      };
    }

    // Validate maximum discount amount
    if (
      couponData.maxDiscountAmount !== undefined &&
      couponData.maxDiscountAmount < 0
    ) {
      throw {
        status: 400,
        message: "Maximum discount amount should be non-negative.",
      };
    }

    // Validate that maximum discount is greater than or equal to the discount value (for fixed discounts)
    if (
      couponData.maxDiscountAmount !== undefined &&
      couponData.discountType === "fixed" &&
      couponData.maxDiscountAmount < couponData.discountValue
    ) {
      throw {
        status: 400,
        message:
          "Maximum discount amount must be greater than or equal to the fixed discount value.",
      };
    }

    // Validate expiry date (must be a future date)
    const currentDate = new Date();
    if (new Date(couponData.expiryDate) <= currentDate) {
      throw { status: 400, message: "Expiry date must be a future date." };
    }

    // Validate usage limit
    if (couponData.usageLimit !== undefined && couponData.usageLimit < 0) {
      throw { status: 400, message: "Usage limit should be non-negative." };
    }

    // Validate user limit
    if (couponData.userLimit < 0) {
      throw { status: 400, message: "User limit should be non-negative." };
    }

    // Update the existing coupon with new values
    Object.assign(existingCoupon, couponData);
    return await existingCoupon.save();
  },

  toggleCouponStatus: async (couponId) => {
    // Find the existing coupon
    const existingCoupon = await Coupon.findById(couponId);
    if (!existingCoupon) {
      throw { status: 404, message: "Coupon not found." };
    }

    // Update the isActive status
    existingCoupon.isActive = !existingCoupon.isActive;

    // Save the updated coupon
    return await existingCoupon.save();
  },

  validatePromoCode: async (userId, promoCode, orderItems, finalAmount) => {
    // Fetch the coupon
    const coupon = await Coupon.findOne({ code: promoCode });

    if (!coupon || !coupon.isActive) {
      throw new Error("Invalid promo code");
    }

    // Check if the coupon is still valid
    const currentDate = new Date();
    if (coupon.expiryDate < currentDate) {
      throw new Error("Promo code has expired");
    }

    // Check if the user has already applied this coupon
    const user = await User.findById(userId);
    const alreadyApplied = user.couponsApplied.filter((c) =>
      c.couponId.equals(coupon._id)
    );

    if (alreadyApplied.length >= coupon.userLimit) {
      throw new Error("Promo code already applied");
    }

    // Check if the products are eligible for the coupon (example: total amount)
    const totalAmount = orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    if (
      totalAmount < coupon.minPurchase ||
      finalAmount <= coupon.minPurchaseAmount
    ) {
      throw new Error(
        `Minimum purchase of ${coupon.minPurchaseAmount} is required to use this promo code`
      );
    }

    const userRequiredByAmount =
      coupon.discountType === "fixed"
        ? (finalAmount - coupon.discountValue).toFixed(2)
        : (finalAmount * (1 - coupon.discountValue / 100)).toFixed(2);

    if (finalAmount - userRequiredByAmount >= coupon.maxDiscountAmount) {
      return {
        couponId: coupon?._id,
        discountType: "fixed",
        discountValue: coupon.maxDiscountAmount,
        couponId: coupon?._id,
      };
    }

    // Return coupon details for later use
    return {
      couponId: coupon?._id,
      discountType: coupon?.discountType,
      discountValue: coupon?.discountValue,
      couponId: coupon?._id,
    };
  },
};
