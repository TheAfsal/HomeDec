const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  isActive: {
    type: Boolean,
    default: true,
  },
  subcategories: [{ type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" }],
});

const subcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  image: String,
  isActive: {
    type: Boolean,
    default: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
});

const Category = mongoose.model("Category", categorySchema);
const SubCategory = mongoose.model("SubCategory", subcategorySchema);
module.exports = { Category, SubCategory };
