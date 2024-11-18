const mongoose = require("mongoose");
const Product = require("../models/productModel");
const { handleError } = require("../Utils/handleError");
const findBestOffer = require("../Utils/findBestOffer");
const Offer = require("../models/offerModel");
const { Category } = require("../models/categoryModel");

module.exports = {
  fetchDetails: async (productId) => {
    try {
      const product = await Product.findById(productId)
        .populate({ path: "subCategory", select: "name offers" })
        .populate({
          path: "offers",
          select: "discountType discountValue expiryDate minPurchaseAmount",
        });

      if (!product) {
        throw new Error("Product not found");
      }

      const firstVariant =
        product.variants.length > 0 ? product.variants[0] : null;
      const price = firstVariant ? firstVariant.price : null;

      if (price === null) {
        throw new Error("Product has no variants with price");
      }

      // Ensure subcategory offers are populated
      const subcategoryOffers = product.subCategory?.offers || [];
      const productOffers = product.offers || [];

      // Fetch offers from database based on IDs
      const populatedSubcategoryOffers = await Offer.find({
        _id: { $in: subcategoryOffers },
      });
      const populatedProductOffers = await Offer.find({
        _id: { $in: productOffers },
      });

      // Combine offers
      const allOffers = [
        ...populatedProductOffers,
        ...populatedSubcategoryOffers,
      ].map((offer) => ({
        discountType: offer.discountType,
        discountValue: offer.discountValue,
        minPurchaseAmount: offer.minPurchaseAmount,
        expiryDate: offer.expiryDate,
      }));

      // Use the common function to find the best offer
      const bestOffer = findBestOffer(allOffers, price);

      return { product, bestOffer };
    } catch (error) {
      throw new Error("Failed to fetch product");
    }
  },

  listProducts: async (sellerId) => {
    try {
      const products = await Product.find({
        sellerId,
      })
        .select("title description variants category subCategory _id")
        .populate({ path: "category", select: "name" })
        .populate({ path: "subCategory", select: "name" });

      const formattedProducts = products.map((product) => {
        const firstVariant =
          product.variants.length > 0 ? product.variants[0] : null;
        const price = firstVariant ? firstVariant.price : null;

        return {
          title: product.title,
          price,
          category: product.category.name,
          subCategory: product.subCategory.name,
          variants: product.variants,
          _id: product._id,
        };
      });

      return formattedProducts;
    } catch (error) {
      throw new Error("Failed to fetch sellers");
    }
  },

  listAllProducts: async (limit, cursor) => {
    try {
      console.log(limit, cursor);

      const query = { "variants.isActive": true };

      if (cursor) {
        query._id = { $gt: cursor };
      }

      const products = await Product.find(query)
        .select("title description variants offers subCategory _id")
        .limit(limit)
        .populate("offers")
        .populate({
          path: "subCategory",
          select: "name offers",
          populate: {
            path: "offers",
          },
        });

      console.log(products);

      const nextCursor =
        products.length > 0 ? products[products.length - 1]._id : null;

      const formattedProducts = products.map((product) => {
        const firstVariant =
          product.variants.length > 0 ? product.variants[0] : null;
        const price = firstVariant ? firstVariant.price : null;
        const image =
          firstVariant && firstVariant.images.length > 0
            ? firstVariant.images[0].secure_url
            : null;

        const productOfferDetails = product.offers.map((offer) => ({
          discountType: offer.discountType,
          discountValue: offer.discountValue,
          minPurchaseAmount: offer.minPurchaseAmount,
          expiryDate: offer.expiryDate,
        }));

        const subcategoryOfferDetails =
          product.subCategory?.offers?.map((offer) => ({
            discountType: offer.discountType,
            discountValue: offer.discountValue,
            minPurchaseAmount: offer.minPurchaseAmount,
            expiryDate: offer.expiryDate,
          })) || [];

        const combinedOffers = [
          ...productOfferDetails,
          ...subcategoryOfferDetails,
        ];

        const bestOffer = findBestOffer(combinedOffers, price);

        return {
          title: product.title,
          description: product.description,
          price,
          image,
          _id: product._id,
          bestOffer: bestOffer || null,
        };
      });

      return { products: formattedProducts, nextCursor };
    } catch (error) {
      throw new Error("Failed to fetch sellers");
    }
  },

  distinctCatForHome: async () => {
    try {
      const distinctCategoryIds = await Product.distinct("category", {
        "variants.isActive": true,
      });

      const categories = await Category.find({
        _id: { $in: distinctCategoryIds },
      })
        .select("name")
        .limit(4);

      const categoryNames = categories.map((category) => category.name);

      return categoryNames;
    } catch (error) {
      throw new Error("Failed to fetch categories");
    }
  },

  fetchProductsforAdmin: async () => {
    try {
      const products = await Product.find()
        .select("title description variants category subCategory _id")
        .populate({ path: "category", select: "name" })
        .populate({ path: "subCategory", select: "name" });

      const formattedProducts = products.map((product) => {
        const firstVariant =
          product.variants.length > 0 ? product.variants[0] : null;
        const price = firstVariant ? firstVariant.price : null;
        // const image =
        //   firstVariant && firstVariant.images.length > 0
        //     ? firstVariant.images[0]
        //     : null;

        return {
          title: product.title,
          price,
          category: product.category.name,
          subCategory: product.subCategory.name,
          variants: product.variants,
          _id: product._id,
        };
      });

      return formattedProducts;
    } catch (error) {
      throw new Error("Failed to fetch sellers");
    }
  },

  toggleVariantStatus: async (productId, variantIndex) => {
    try {
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
    {
      category,
      subCategory,
      title,
      description,
      deliveryCondition,
      warranty,
      relatedKeywords,
      itemProperties,
      variants,
    },
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
        variants: variants.map((variant) => ({
          ...variant,
          images: variant.images.map((img) => {
            return { temp_url: `${img}.png`, secure_url: "pending" };
          }),
        })),
      };

      const product = new Product(productData);
      await product.save();
    } catch (error) {
      throw handleError(error);
    }
  },

  editProduct: async (
    {
      category,
      subCategory,
      title,
      description,
      deliveryCondition,
      warranty,
      relatedKeywords,
      itemProperties,
      variants,
    },
    prodId,
    sellerId
  ) => {
    try {
      const product = await Product.findById({ _id: prodId, sellerId });

      if (!product) {
        throw new Error("Product not found");
      }

      product.category = category;
      product.subCategory = subCategory;
      product.title = title;
      product.description = description;
      product.deliveryCondition = deliveryCondition;
      product.warranty = warranty;
      product.relatedKeywords = relatedKeywords;
      product.itemProperties = itemProperties;

      product.variants = variants.map((variant) => ({
        ...variant,
        images: variant.images.map((img) => ({
          temp_url: `${img}.png`,
          secure_url: "pending",
        })),
      }));

      await product.save();
    } catch (error) {
      throw handleError(error);
    }
  },

  updateProduct: async (productId, updateData) => {
    try {
      const product = await Product.findByIdAndUpdate(productId, updateData, {
        new: true, // Return the updated document
        runValidators: true, // Ensure validators are run
      });

      if (!product) {
        throw new Error("Product not found");
      }

      return product;
    } catch (error) {
      throw handleError(error);
    }
  },

  searchProducts: async (query, sort, filter) => {
    try {
      filter?.value.split(",");

      const searchQuery = {
        $and: [
          query
            ? {
                $or: [
                  { title: { $regex: query, $options: "i" } },
                  { description: { $regex: query, $options: "i" } },
                  { relatedKeywords: { $regex: query, $options: "i" } },
                ],
              }
            : {},
          filter.option === "category" &&
          filter.value !== "undefined" &&
          filter?.value?.length !== 0
            ? { category: filter?.value.split(",") }
            : {},
        ],
      };

      // Define sorting options
      const sortOptions = {
        priceLowToHigh: { "variants.0.price": 1 },
        priceHighToLow: { "variants.0.price": -1 },
        newArrivals: { createdAt: -1 },
        rating: { rating: 1 },
        aA_zZ: { title: 1, titleLower: 1 },
        zZ_aA: { title: -1, titleLower: -1 },
        // popularity: { popularity: -1 },
      };

      // Determine the sorting criteria
      const sortCriteria = sortOptions[sort] || {};

      //

      // Fetch products with search query and sorting
      const products = await Product.find(searchQuery)
        .populate("offers")
        .populate({
          path: "subCategory",
          select: "name offers",
          populate: {
            path: "offers",
          },
        })
        .sort(sortCriteria);

      //
      //

      // Format products and find the best offer
      const formattedProducts = products.map((product) => {
        const firstVariant = product.variants.find((v) => v.isActive);
        const price = firstVariant ? firstVariant.price : null;
        const image = firstVariant ? firstVariant.images[0] : null;

        // Collect all offers
        const productOfferDetails = product.offers.map((offer) => ({
          discountType: offer.discountType,
          discountValue: offer.discountValue,
          minPurchaseAmount: offer.minPurchaseAmount,
          expiryDate: offer.expiryDate,
        }));

        const subcategoryOfferDetails =
          product.subCategory?.offers?.map((offer) => ({
            discountType: offer.discountType,
            discountValue: offer.discountValue,
            minPurchaseAmount: offer.minPurchaseAmount,
            expiryDate: offer.expiryDate,
          })) || [];

        const combinedOffers = [
          ...productOfferDetails,
          ...subcategoryOfferDetails,
        ];

        // Use the common function to find the best offer
        const bestOffer = findBestOffer(combinedOffers, price);

        return {
          _id: product._id,
          title: product.title,
          description: product.description,
          price,
          image,
          bestOffer: bestOffer || null, // Include best offer details
        };
      });

      return formattedProducts;
    } catch (error) {}
  },
};

// Collect all offers
//  const offers = product.offers.map((offer) => ({
//   discountType: offer.discountType,
//   discountValue: offer.discountValue,
//   minPurchaseAmount: offer.minPurchaseAmount,
//   expiryDate: offer.expiryDate,
// }));
