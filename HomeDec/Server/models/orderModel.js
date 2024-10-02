const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
    },
    mobile: {
      type: Number,
      match: [/^\d{14}$/, "Please provide a valid 10-digit mobile number"],
    },
    alternateMobile: {
      type: Number,
      match: [/^\d{14}$/, "Please provide a valid 10-digit mobile number"],
    },
    orderLabel: {
      type: String,
    },
    street: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    postalCode: {
      type: Number,
    },
    country: {
      type: String,
    },
    orderItems: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        variantId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        isCancelled: {
          type: Boolean,
          default: false,
        },
        isReturned: {
          type: Boolean,
          default: false,
        },
        status: {
          type: String,
          enum: [
            "Pending",
            "Processing",
            "On Hold",
            "Shipping",
            "Delivered",
            "Cancelled",
            "Returned",
          ],
          default: "Pending",
        },
      },
    ],
    paymentMethod: {
      type: String,
      enum: ["pending", "online", "wallet", "cod"],
    },
    shippingCharge: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    discountApplied: {
      type: Number, // store the discount amount
      default: 0,
    },
    finalTotal: {
      type: Number, // total after discount
      required: true,
    },
    appliedCoupon: {
      type: String, // coupon code
    },
    dateOrdered: {
      type: Date,
      default: Date.now(),
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Middleware to update updatedAt field
orderSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
