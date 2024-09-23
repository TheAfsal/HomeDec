const mongoose = require("mongoose");
const { Category, SubCategory } = require("../models/categoryModel");

module.exports = {
  addCategory: async (categoryName, subCategoryName) => {
    console.log(categoryName, subCategoryName);

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      let category = await Category.findOne({ name: categoryName }).session(
        session
      );
      if (!category) {
        category = new Category({ name: categoryName });
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

      return;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw new Error("Category creation failed");
    }
  },

  listCategory: async () => {
    try {
      const categories = await Category.find()
        .populate("subcategories", "name description")
        .exec();
      return categories;

    } catch (error) {
      throw new Error("Failed to fetch categories")
    }
  },
};
