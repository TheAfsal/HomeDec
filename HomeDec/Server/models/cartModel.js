const mongoose = require("mongoose");
const { Schema } = mongoose;

const CartsSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: "User",
    },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
        variantId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true, // Store the variant ID as an ObjectId
        },
        quantity: { type: Number, required: true, min: 1 }, 
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Cart", CartsSchema);
