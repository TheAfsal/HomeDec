const mongoose = require("mongoose");
const { Category, SubCategory } = require("../models/categoryModel");

module.exports = {
  addCategory: async (categoryName, description, subCategoryName) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      let category = await Category.findOne({ name: categoryName }).session(
        session
      );
      if (!category) {
        category = new Category({ name: categoryName, description });
        await category.save({ session });
      }
      console.log(category._id);

      let subcategory = await SubCategory.findOne({
        name: subCategoryName,
      }).session(session);
      if (!subcategory) {
        subcategory = new SubCategory({
          name: subCategoryName,
          category: category._id,
        });
        await subcategory.save({ session });
      } else {
        subcategory.isBlocked = isBlocked;
        await subcategory.save({ session });
      }

      if (!category.subcategories.includes(subcategory._id)) {
        category.subcategories.push(subcategory._id);
        await category.save({ session });
      }

      await session.commitTransaction();
      session.endSession();

      return { categoryName, description, subCategoryName };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw new Error("Category creation failed");
    }
  },

  listCategory: async (itemsNeeded) => {
    try {
      const categories = await Category.find({ isActive: true })
        .populate({
          path: "subcategories",
          match: { isActive: true }, 
          select: itemsNeeded, 
        })
        .exec();
      return categories;
    } catch (error) {
      throw new Error("Failed to fetch categories");
    }
  },

  toggleCategoryStatus: async (catId) => {
    console.log(catId);

    const subCategory = await SubCategory.findById({ _id: catId });
    console.log(subCategory);

    if (!subCategory) {
      throw new Error("Category not found");
    }

    subCategory.isActive = !subCategory.isActive;

    await subCategory.save();

    const status = subCategory.isActive ? "activated" : "deactivated";
    return { message: `Category successfully ${status}`, subCategory };
  },

  editCategory: async (
    categoryName,
    categoryId,
    subcategoryName,
    subcategoryId
  ) => {
    try {
      console.log(categoryName, categoryId, subcategoryName, subcategoryId);

      // Update category name
      var updatedCategory;
      if (categoryId) {
        updatedCategory = await Category.findByIdAndUpdate(
          categoryId,
          { name: categoryName },
          { new: true, runValidators: true } // new: true returns the updated document
        );

        if (!updatedCategory) {
          throw new Error("Category not found");
        }
      }

      // Update subcategory name
      var updatedSubcategory;
      if (subcategoryId) {
        updatedSubcategory = await SubCategory.findByIdAndUpdate(
          subcategoryId,
          { name: subcategoryName },
          { new: true, runValidators: true }
        );

        if (!updatedSubcategory) {
          throw new Error("Subcategory not found");
        }
      }

      return {
        message: "Update successful",
        updatedCategory,
        updatedSubcategory,
      };
    } catch (error) {
      throw new Error(`Update failed: ${error.message}`);
    }
  },
};
