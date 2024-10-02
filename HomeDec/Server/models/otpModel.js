const mongoose = require("mongoose");
const validator = require("validator");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Invalid email format',
    },
  },
  otp: {
    type: String,
    required: true,
    minlength: 4, // Minimum length for OTP
    maxlength: 6, // Maximum length for OTP
  },
  createdAt: {
    type: Date,
    expires: "5m", // Automatically remove after 5 minutes
    default: Date.now,
  },
});

const Otp = mongoose.model("Otp", otpSchema);

module.exports = Otp;
