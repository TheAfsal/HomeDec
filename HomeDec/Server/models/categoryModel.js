const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: (v) => /^[a-zA-Z0-9\s]+$/.test(v), // Allow letters, numbers, and spaces
      message: "Category name must not contain special characters",
    },
  },
  description: {
    type: String,
    maxlength: 500,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  subcategories: [{ type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" }],
});

// Pre-save hook for Category
categorySchema.pre("save", function (next) {
  if (this.name) {
    this.name =
      this.name.charAt(0).toUpperCase() + this.name.slice(1).toLowerCase(); // Capitalize first letter, lowercase others
  }
  next();
});

const Category = mongoose.model("Category", categorySchema);

const subcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: (v) => /^[a-zA-Z0-9\s]+$/.test(v), // Allow letters, numbers, and spaces
      message: "Subcategory name must not contain special characters",
    },
  },
  image: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  offers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Offer',
  }],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
});

// Pre-save hook for SubCategory
subcategorySchema.pre("save", function (next) {
  if (this.name) {
    this.name =
      this.name.charAt(0).toUpperCase() + this.name.slice(1).toLowerCase(); // Capitalize first letter, lowercase others
  }
  next();
});

const SubCategory = mongoose.model("SubCategory", subcategorySchema);

module.exports = { Category, SubCategory };
