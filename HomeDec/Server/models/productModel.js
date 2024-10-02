  const mongoose = require("mongoose");

  const productSchema = new mongoose.Schema(
    {
      category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category", // Reference to the Category model
        required: true,
      },
      subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory", // Reference to the SubCategory model
        required: true,
      },
      title: {
        type: String,
        required: true,
        trim: true,
        validate: {
          validator: (v) => /^[a-zA-Z0-9\s]+$/.test(v), // Allow letters, numbers, and spaces
          message: "Title must not contain special characters",
        },
      },
      description: {
        type: String,
        required: true,
        trim: true,
        validate: {
          validator: (v) => /^[a-zA-Z0-9\s]+$/.test(v), // Allow letters, numbers, and spaces
          message: "Description must not contain special characters",
        },
      },
      variants: [
        {
          color: {
            type: String,
            required: true,
            trim: true,
            validate: {
              validator: (v) => /^[a-zA-Z0-9\s]+$/.test(v), // Allow letters, numbers, and spaces
              message: "Colors must not contain special characters",
            },
          },
          colorHex: {
            type: String,
            required: true,
            validate: {
              validator: (v) => /^#[0-9A-F]{6}$/i.test(v), // Hex color validation
              message: "Invalid color hex format",
            },
          },
          stock: {
            type: Number,
            required: true,
            min: 0,
          },
          price: {
            type: Number,
            required: true,
            min: 0,
          },
          isActive: {
            type: Boolean,
            default: true,
          },
          images: {
            type: [Object],
          },
        },
      ],
      itemProperties: [
        {
          field: {
            type: String,
            required: true,
            trim: true,
          },
          value: {
            type: String,
            required: true,
            trim: true,
          },
        },
      ],
      sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "sellers",
        required: true,
      },
      deliveryCondition: {
        type: String,
        required: true,
        trim: true,
      },
      warranty: {
        type: String,
        required: true,
        trim: true,
      },
      relatedKeywords: {
        type: String,
        required: true,
        trim: true,
      },
    },
    { timestamps: true }
  );

  const Product = mongoose.model("Product", productSchema);

  module.exports = Product;
