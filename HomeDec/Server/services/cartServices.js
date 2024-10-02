const mongoose = require("mongoose");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");

module.exports = {
  listCartItems: async (cartId) => {
    try {
      const cart = await Cart.findById(cartId).populate({
        path: "products.productId",
        select: "title variants",
      });

      const cartWithVariants = cart.products.map((item) => {
        const product = item.productId;
        const variant = product.variants.find(
          (v) => v._id.toString() === item.variantId.toString()
        );

        return {
          productDetails: {
            _id: product._id,
            title: product.title,
          },
          variantId: item.variantId,
          quantity: item.quantity,
          variantDetails: {
            price: variant.price,
            stock: variant.stock,
            color: variant.color,
            image: variant.images[0]?.secure_url,
          },
        };
      });

      return {
        ...cart._doc,
        products: cartWithVariants,
      };
    } catch (error) {
      console.log(error);

      throw new Error("Failed to fetch sellers");
    }
  },

  addProductToCart: async (cartId, productId, variantId, quantity) => {
    console.log(cartId, productId, variantId, quantity);

    try {
      let cart = await Cart.findOne({ _id: cartId });

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

      const existingProduct = cart.products.find(
        (item) =>
          item.productId.toString() === productId &&
          item.variantId.toString() === variantId
      );

      if (variant.stock < existingProduct?.quantity + Number(quantity)) {
        throw { status: 400, message: `Only ${variant.stock} stocks left` };
      }

      if (existingProduct) {
        existingProduct.quantity += Number(quantity);
      } else {
        cart.products.push({ productId, variantId, quantity });
      }

      await cart.save();

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
      
      if (existingProduct) {
        details.quantity = existingProduct.quantity;
      } else {
        details.quantity = quantity;
      }
      return details;

    } catch (error) {
      throw error;

    }
  },

  removeProductToCart: async (cartId, productId, variantId) => {
    try {
      const cart = await Cart.findOne({ _id: cartId });

      if (!cart) {
        throw { status: 400, message: "Cart not found for this user." };
      }
      console.log(productId, variantId);
      console.log(cart);

      const productIndex = cart.products.findIndex(
        (item) =>
          item.productId.toString() === productId &&
          item.variantId.toString() === variantId
      );

      console.log(productIndex);

      if (productIndex === -1) {
        throw { status: 400, message: "Product not found in the cart." };
      }

      cart.products.splice(productIndex, 1);

      await cart.save();
      return {productId, variantId};
    } catch (error) {
      console.log(error);

      throw error;
    }
  },
};
