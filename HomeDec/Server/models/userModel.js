const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (v) => /^[a-zA-Z0-9\s]+$/.test(v), // Allow letters, numbers, and spaces
        message: "Category name must not contain special characters",
      },
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (v) => /^[a-zA-Z0-9\s]+$/.test(v), // Allow letters, numbers, and spaces
        message: "Category name must not contain special characters",
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (v) => validator.isEmail(v),
        message: "Invalid email format",
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // Minimum length for password
    },
    dob: {
      type: Date, // Changed to Date type for better handling
    },
    gender: {
      type: String,
      enum: ["Male", "Female"], // Optional: Enum for gender
    },
    phoneNumber: {
      type: Number,
      validate: {
        validator: (v) => /^\+?[1-9]\d{1,14}$/.test(v), // E.164 format validation
        message: "Invalid phone number format",
      },
    },
    image: {
      type: Object,
    },
    cartId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart", // Reference to Cart model
    },
    addressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address", // Reference to Address model
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
