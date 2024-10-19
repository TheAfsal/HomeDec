const mongoose = require("mongoose");
const Address = require("../models/addressModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");
const Wishlist = require("../models/wishListModel");
const { handleError } = require("../Utils/handleError");
const { ObjectId } = mongoose.Types;

module.exports = {
  listAddresses: async (addressId) => {
    try {
      const addressList = await Address.findOne(
        { _id: addressId },
        { userId: 0, updatedAt: 0, createdAt: 0 }
      );
      console.log(addressList);

      if (!addressList) {
        throw { status: 400, message: "Address list not exist" };
      }
      return addressList;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  AddNewAddress: async (addressId, addressDetails) => {
    try {
      const address = await Address.findOne({ _id: addressId });
      if (
        address.addresses.some((addr) => addr.label === addressDetails.label)
      ) {
        throw { status: 400, message: "Address label must be unique" };
      }

      const updatedAddress = await Address.findOneAndUpdate(
        { _id: addressId },
        { $push: { addresses: addressDetails } },
        { new: true, upsert: true }
      );
      return updatedAddress;
    } catch (error) {
      if (error.status) throw error;
      else throw { status: 500, message: "Server error" };
    }
  },

  deleteAddress: async (addressId, itemId) => {
    try {
      const updatedAddress = await Address.findOneAndUpdate(
        { _id: addressId },
        { $pull: { addresses: { _id: itemId } } },
        { new: true }
      );

      if (!updatedAddress) {
        throw { status: 404, message: "Address list not found" };
      }

      return itemId;
    } catch (error) {
      console.log(error);

      if (error.status) throw error;
      else throw handleError(error);
    }
  },

  fetchWishList: async (wishlistId) => {
    try {
      const wishlist = await Wishlist.findById(wishlistId).populate({
        path: "items.productId",
        select: "title variants",
      });

      const wishlistWithVariants = wishlist.items.map((item) => {
        const product = item.productId;
        const variant = product.variants.find(
          (v) => v._id.toString() === item.variantId.toString()
        );

        return {
          productId: product._id,
          variantId: item.variantId,
          title: product.title,
          price: variant.price,
          color: variant.color,
          image: variant.images[0]?.secure_url,
        };
      });

      if (!wishlist) {
        throw { status: 400, message: "WishList not exist" };
      }

      return wishlistWithVariants;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  addProductToWishList: async (wishlistId, productId, variantId) => {
    console.log(wishlistId, productId, variantId);

    try {
      let wishlist = await Wishlist.findOne({ _id: wishlistId });

      const product = await Product.findById(productId);

      if (!product) {
        throw { status: 400, message: "Product not found" };
      }

      const variant = product.variants.find(
        (v) => v._id.toString() === variantId
      );

      if (!variant) {
        throw { status: 400, message: "Variant not found" };
      }

      console.log(wishlist);

      const existingProduct = wishlist?.items.find(
        (item) =>
          item.productId.toString() === productId &&
          item.variantId.toString() === variantId
      );

      if (existingProduct)
        throw { status: 400, message: "Product with same variant exist" };

      wishlist.items.push({ productId, variantId });

      await wishlist.save();

      let details = {
        productDetails: {
          _id: productId,
          title: product.title,
        },
        variantId,
        variantDetails: {
          color: variant.color,
          image: variant.images[0].secure_url,
          price: variant.price,
          stock: variant.stock,
        },
      };

      return details;
    } catch (error) {
      console.log(error);

      throw error;
    }
  },

  removeProductsFromWishList: async (wishlistId, itemsToRemoveArray) => {
    console.log(wishlistId, itemsToRemoveArray);

    try {
      // Find the wishlist by ID
      let wishlist = await Wishlist.findOne({ _id: wishlistId });

      if (!wishlist) {
        throw { status: 404, message: "Wishlist not found" };
      }

      // Iterate over the items to remove
      itemsToRemoveArray.forEach(({ productId, variantId }) => {
        // Find the index of the item in the wishlist
        const itemIndex = wishlist.items.findIndex(
          (item) =>
            item.productId.equals(productId) && item.variantId.equals(variantId)
        );

        // If the item exists, remove it
        if (itemIndex !== -1) {
          wishlist.items.splice(itemIndex, 1);
          console.log(
            `Removed item: ProductId: ${productId}, VariantId: ${variantId}`
          );
        } else {
          console.log(
            `Item not found: ProductId: ${productId}, VariantId: ${variantId}`
          );
        }
      });

      // Save the updated wishlist
      await wishlist.save();

      // Return a success message
      return { message: "Selected items successfully removed from wishlist" };
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  getUsersCountByMonth: async () => {
    try {
      const results = await User.aggregate([
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1 }, 
        },
      ]);

      // Format the results for the client-side pie chart
      const formattedResults = results.map((item) => ({
        month: `${item._id.year}-${String(item._id.month).padStart(2, "0")}`, // Format YYYY-MM
        count: item.count,
      }));

      return formattedResults;
    } catch (error) {
      console.error("Error fetching user counts by month:", error);
      throw error; // Handle the error as needed
    }
  },
};
