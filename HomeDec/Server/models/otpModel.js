// otpModel.js
const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, expires: "5m", default: Date.now }, // Automatically remove after 5 minutes
});

const Otp = mongoose.model("Otp", otpSchema);

module.exports = Otp;
