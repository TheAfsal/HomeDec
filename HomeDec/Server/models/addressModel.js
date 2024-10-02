const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    addresses: [
      {
        label: {
          type: String,
          unique: true,
          trim: true,
        },
        mob: {
          type: Number,
          required: true,
        },
        street: {
          type: String,
          required: true,
        },
        city: {
          type: String,
          required: true,
        },
        state: {
          type: String,
          required: true,
        },
        postalCode: {
          type: String,
          required: true,
        },
        country: {
          type: String,
          required: true,
        },
        primary: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true }
);

const Address = mongoose.model("Address", addressSchema);

module.exports = Address;
