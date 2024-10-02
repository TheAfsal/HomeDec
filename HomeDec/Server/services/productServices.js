const mongoose = require("mongoose");
const Product = require("../models/productModel");
const { handleError } = require("../Utils/handleError");

module.exports = {
  fetchDetails: async (productId) => {
    try {
      const product = await Product.find({ _id: productId });
      return product;
    } catch (error) {
      throw new Error("Failed to fetch product");
    }
  },

  listProducts: async (sellerId) => {
    try {
      console.log(sellerId);

      const products = await Product.find({ sellerId });
      console.log(products);

      return products;
    } catch (error) {
      console.log(sellerId);
      throw new Error("Failed to fetch sellers");
    }
  },

  listAllProducts: async () => {
    try {
      const products = await Product.find({ "variants.isActive": true });
      return products;
    } catch (error) {
      throw new Error("Failed to fetch sellers");
    }
  },

  toggleVariantStatus: async (productId, variantIndex) => {
    try {
      console.log(productId, variantIndex);
      const product = await Product.findOne({ _id: productId });

      if (!product) {
        throw new Error("Product not found");
      }

      if (variantIndex < 0 || variantIndex >= product.variants.length) {
        throw new Error("Variant index out of bounds");
      }

      const update = {
        [`variants.${variantIndex}.isActive`]:
          !product.variants[variantIndex].isActive,
      };

      const updatedProduct = await Product.findOneAndUpdate(
        { _id: productId },
        { $set: update },
        { new: true }
      );

      if (!updatedProduct) {
        throw new Error("Failed to update product");
      }

      const updatedVariant = updatedProduct.variants[variantIndex];
      const status = updatedVariant.isActive ? "activated" : "deactivated";

      return {
        status: 200,
        message: `Variant successfully ${status}`,
        variant: updatedVariant,
      };
    } catch (error) {
      console.error(error);
      return { status: 500, message: "Internal server error" };
    }
  },

  addProduct: async (
    category,
    subCategory,
    title,
    description,
    deliveryCondition,
    warranty,
    relatedKeywords,
    itemProperties,
    variants,
    uploadedImages,
    sellerId
  ) => {
    try {
      const productData = {
        category,
        subCategory,
        title,
        description,
        deliveryCondition,
        warranty,
        relatedKeywords,
        itemProperties,
        sellerId,
        variants: variants.map((variant, index) => ({
          ...variant,
          images: uploadedImages[index],
        })),
      };

      const product = new Product(productData);
      await product.save();
    } catch (error) {
      console.log(error);

      throw handleError(error);
    }
  },

  searchProducts: async (query, sort) => {
    try {
      console.log("query", query);
      console.log("sort", sort);

      const searchQuery = query
        ? {
            $or: [
              { title: { $regex: query, $options: "i" } },
              { description: { $regex: query, $options: "i" } },
              { relatedKeywords: { $regex: query, $options: "i" } },
            ],
          }
        : {};

      // Define sorting options
      const sortOptions = {
        priceLowToHigh: { "variants.price": 1 },
        priceHighToLow: { "variants.price": -1 },
        // popularity: { popularity: -1 },
      };

      // Determine the sorting criteria
      const sortCriteria = sortOptions[sort] || {};
      console.log(sortCriteria);
      console.log(searchQuery);

      // Fetch products with search query and sorting
      const products = await Product.find(searchQuery).sort(sortCriteria);
      return products;
    } catch (error) {
      console.log(error);
    }
  },
};
