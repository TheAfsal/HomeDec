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
        discount: {
          type: Number,
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
    payment: {
      method: {
        type: String,
        enum: ["pending", "online", "cod", "wallet"],
        default: "pending",
      },
      transactionId: {
        type: String,
      },
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
    finalAmount: {
      type: Number, // total after discount
      required: true,
    },
    couponsApplied: [
      {
        couponId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Coupon",
        },
        discountAmount: {
          type: Number,
        },
        discountType: {
          type: String,
          enum: ["percentage", "fixed"], // Define the type of discount
        },
      },
    ],
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
