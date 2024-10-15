const { default: mongoose } = require("mongoose");
const { SubCategory } = require("../models/categoryModel");
const Offer = require("../models/offerModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");

module.exports = {
  createOffer: async (offerData) => {
    const { selectedProducts, selectedCategories } = offerData;
    const { ...restOfOfferData } = offerData.data;

    // Validate that there are selected products and categories
    if (!selectedProducts || selectedProducts.length === 0) {
      throw { status: 400, message: "At least one product must be selected." };
    }

    if (!selectedCategories || selectedCategories.length === 0) {
      throw { status: 400, message: "At least one category must be selected." };
    }

    console.log(restOfOfferData.discountType);

    // Validate discount type
    if (!["percentage", "fixed"].includes(restOfOfferData.discountType)) {
      throw {
        status: 400,
        message: 'Invalid discount type. It should be "percentage" or "fixed".',
      };
    }

    // Validate discount value
    if (restOfOfferData.discountType === "percentage") {
      if (
        restOfOfferData.discountValue <= 0 ||
        restOfOfferData.discountValue > 100
      ) {
        throw {
          status: 400,
          message: "Percentage discount value should be between 1 and 100.",
        };
      }
    } else if (restOfOfferData.discountType === "fixed") {
      if (restOfOfferData.discountValue <= 0) {
        throw {
          status: 400,
          message: "Fixed discount value should be greater than 0.",
        };
      }
    }

    // Validate minimum purchase amount
    if (
      restOfOfferData.minPurchaseAmount !== undefined &&
      restOfOfferData.minPurchaseAmount < 0
    ) {
      throw {
        status: 400,
        message: "Minimum purchase amount should be non-negative.",
      };
    }

    // Validate maximum discount amount
    if (
      restOfOfferData.maxDiscountAmount !== undefined &&
      restOfOfferData.maxDiscountAmount < 0
    ) {
      throw {
        status: 400,
        message: "Maximum discount amount should be non-negative.",
      };
    }

    // Validate that maximum discount is greater than or equal to the discount value (for fixed discounts)
    if (
      restOfOfferData.maxDiscountAmount !== undefined &&
      restOfOfferData.discountType === "fixed" &&
      restOfOfferData.maxDiscountAmount < restOfOfferData.discountValue
    ) {
      throw {
        status: 400,
        message:
          "Maximum discount amount must be greater than or equal to the fixed discount value.",
      };
    }

    // Validate expiry date (must be a future date)
    const currentDate = new Date();
    if (new Date(restOfOfferData.expiryDate) <= currentDate) {
      throw { status: 400, message: "Expiry date must be a future date." };
    }

    // Validate usage limit
    if (
      restOfOfferData.usageLimit !== undefined &&
      restOfOfferData.usageLimit < 0
    ) {
      throw { status: 400, message: "Usage limit should be non-negative." };
    }

    // Validate user limit
    if (restOfOfferData.userLimit < 0) {
      throw { status: 400, message: "User limit should be non-negative." };
    }

    const products = selectedProducts.reduce((acc, product) => {
      acc[product.id] = product.title;
      return acc;
    }, {});

    const categories = selectedCategories.reduce((acc, category) => {
      acc[category.id] = category.title;
      return acc;
    }, {});

    // Create the offer
    const offer = new Offer({
      ...restOfOfferData,
      products,
      categories,
    });

    // Save the offer
    const savedOffer = await offer.save();

    // Update products to include the new offer ID
    await Product.updateMany(
      { _id: { $in: Object.keys(products) } },
      { $addToSet: { offers: savedOffer._id } }
    );

    // Update categories to include the new offer ID
    await SubCategory.updateMany(
      { _id: { $in: Object.keys(categories) } },
      { $addToSet: { offers: savedOffer._id } }
    );

    return savedOffer;
  },

  getAllOffers: async () => {
    return await Offer.find().sort({ expiryDate: 1 });
  },

  updateOffer: async (offerId, offerData) => {
    const { selectedProducts, selectedCategories } = offerData;
    const { ...restOfOfferData } = offerData.data;

    // Fetch the existing offer
    const existingOffer = await Offer.findById(offerId);
    if (!existingOffer) {
      throw { status: 404, message: "Offer not found." };
    }

    // Validate that there are selected products and categories
    if (!selectedProducts || selectedProducts.length === 0) {
      throw { status: 400, message: "At least one product must be selected." };
    }

    if (!selectedCategories || selectedCategories.length === 0) {
      throw { status: 400, message: "At least one category must be selected." };
    }

    // (Validation checks remain unchanged)

    // Prepare products and categories for update
    const newProducts = selectedProducts.reduce((acc, product) => {
      acc[product.id] = product.title;
      return acc;
    }, {});

    const newCategories = selectedCategories.reduce((acc, category) => {
      acc[category.id] = category.title;
      return acc;
    }, {});

    // Convert existing products and categories to plain objects
    const existingProducts = Object.fromEntries(existingOffer.products);
    const existingCategories = Object.fromEntries(existingOffer.categories);

    // Determine products and categories to remove
    const productsToRemove = Object.keys(existingProducts).filter(
      (id) => !newProducts[id]
    );
    const categoriesToRemove = Object.keys(existingCategories).filter(
      (id) => !newCategories[id]
    );

    console.log(2);
    console.log("productsToRemove", productsToRemove);
    console.log("categoriesToRemove", categoriesToRemove);

    // Update the offer
    Object.assign(existingOffer, {
      ...restOfOfferData,
      products: newProducts,
      categories: newCategories,
    });

    const updatedOffer = await existingOffer.save();

    // Update products to include the updated offer ID
    await Product.updateMany(
      { _id: { $in: Object.keys(newProducts) } },
      { $addToSet: { offers: updatedOffer._id } }
    );

    // Remove the offer ID from products that are no longer associated
    await Product.updateMany(
      { _id: { $in: productsToRemove } },
      { $pull: { offers: updatedOffer._id } }
    );

    // Update categories to include the updated offer ID
    await SubCategory.updateMany(
      { _id: { $in: Object.keys(newCategories) } },
      { $addToSet: { offers: updatedOffer._id } }
    );

    // Remove the offer ID from categories that are no longer associated
    await SubCategory.updateMany(
      { _id: { $in: categoriesToRemove } },
      { $pull: { offers: updatedOffer._id } }
    );

    return updatedOffer;
  },

  toggleOfferStatus: async (offerId) => {
    const existingOffer = await Offer.findById(offerId);
    if (!existingOffer) {
      throw { status: 404, message: "offer not found." };
    }

    // Update the isActive status
    existingOffer.isActive = !existingOffer.isActive;

    // Save the updated coupon
    return await existingOffer.save();
  },

  //   validatePromoCode : async (userId, promoCode, orderItems) => {
  //     // Fetch the coupon
  //     const coupon = await Coupon.findOne({ code: promoCode });

  //     if (!coupon) {
  //       throw new Error('Invalid promo code');
  //     }

  //     // Check if the coupon is still valid
  //     const currentDate = new Date();
  //     if (coupon.expirationDate < currentDate) {
  //       throw new Error('Promo code has expired');
  //     }

  //     // Check if the user has already applied this coupon
  //     const user = await User.findById(userId);
  //     const alreadyApplied = user.couponsApplied.some(c => c.couponId.equals(coupon._id));
  //     if (alreadyApplied) {
  //       throw new Error('Promo code already applied');
  //     }

  //     // Check if the products are eligible for the coupon (example: total amount)
  //     const totalAmount = orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  //     if (totalAmount < coupon.minPurchase) {
  //       throw new Error(`Minimum purchase of ${coupon.minPurchase} is required to use this promo code`);
  //     }

  //     // Return coupon details for later use
  //     return {
  //       couponId: coupon?._id,
  //       discountType: coupon?.discountType,
  //       discountValue: coupon?.discountValue,
  //       couponId: coupon?._id,
  //     };
  //   },
};
