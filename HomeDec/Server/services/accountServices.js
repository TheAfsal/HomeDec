const Address = require("../models/addressModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");
const Wishlist = require("../models/wishListModel");
const { handleError } = require("../Utils/handleError");

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

        console.log(variant);

        return {
          productId: product._id,
          variantId: item.variantId,
          title: product.title,
          price: variant.price,
          color: variant.color,
          image: variant.images[0]?.secure_url,
        };
      });

      return wishlistWithVariants;

      console.log("========");

      if (!wishlist) {
        throw { status: 400, message: "WishList not exist" };
      }
      return wishlist;
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

      const existingProduct = wishlist.items.find(
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
};
