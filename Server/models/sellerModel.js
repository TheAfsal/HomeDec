const mongoose = require("mongoose");
const validator = require("validator");

const sellerSchema = new mongoose.Schema({
  sellerName: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: (v) => /^[a-z0-9\s]+$/.test(v), // Only allows lowercase letters, numbers, and spaces
      message: 'Seller name must not contain special characters',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Invalid email format',
    },
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  businessName: {
    type: String,
  },
  TIN: {
    type: String,
  },
  document: {
    type: String,
  },
  contactNumber: {
    type: String,
    validate: {
      validator: (v) => /^\+?[1-9]\d{1,14}$/.test(v), // E.164 format validation
      message: 'Invalid contact number format',
    },
  },
  alternateContactNumber: {
    type: String,
    validate: {
      validator: (v) => /^\+?[1-9]\d{1,14}$/.test(v), // E.164 format validation
      message: 'Invalid alternate contact number format',
    },
  },
  address: {
    type: String,
  },
  commissionRate: {
    type: Number,
    validate: {
      validator: (v) => v > 0,
      message: 'Commission rate must be greater than 0',
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

module.exports = mongoose.model("Seller", sellerSchema);
