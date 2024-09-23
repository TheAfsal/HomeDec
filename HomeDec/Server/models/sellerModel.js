const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema({
  sellerName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
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
  },
  alternateContactNumber: {
    type: String,
  },
  isActive:{
    type:Boolean,
    default:true
  },
},{timestamps:true});

module.exports = mongoose.model("Seller", sellerSchema);
