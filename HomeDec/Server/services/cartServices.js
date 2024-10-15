const mongoose = require("mongoose");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const { removeProductsFromWishList } = require("./accountServices");
const findBestOffer = require("../Utils/findBestOffer");

module.exports = {
  listCartItems: async (cartId) => {
    try {
      const cart = await Cart.findById(cartId).populate({
        path: "products.productId",
        select: "title variants subCategory offers",
        populate: [
          {
            path: "offers",
            select: "discountType discountValue expiryDate minPurchaseAmount",
          },
          {
            path: "subCategory",
            select: "offers",
            populate: {
              path: "offers",
              select: "discountType discountValue expiryDate minPurchaseAmount",
            },
          },
        ],
      });

      console.log(cart);

      const cartWithVariants = cart.products.map((item) => {
        const product = item.productId;
        const variant = product.variants.find(
          (v) => v._id.toString() === item.variantId.toString()
        );

        // Get offers from both product and subcategory
        const productOffers = product.offers.map((offer) => ({
          discountType: offer.discountType,
          discountValue: offer.discountValue,
          expiryDate: offer.expiryDate,
          minPurchaseAmount: offer.minPurchaseAmount,
        }));

        const subcategoryOffers =
          product.subCategory?.offers?.map((offer) => ({
            discountType: offer.discountType,
            discountValue: offer.discountValue,
            expiryDate: offer.expiryDate,
            minPurchaseAmount: offer.minPurchaseAmount,
          })) || [];

        // Combine offers
        const allOffers = [...productOffers, ...subcategoryOffers];

        // Calculate the best offer for the variant price
        const bestOffer = findBestOffer(allOffers, variant.price);

        return {
          productDetails: {
            _id: product._id,
            title: product.title,
            offers: allOffers,
            bestOffer: bestOffer || null, // Include best offer details
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
      throw new Error("Failed to fetch cart items");
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
      throw error
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
      return { productId, variantId };
    } catch (error) {
      console.log(error);

      throw error;
    }
  },

  addMultipleProductsToCart: async (cartId, products, wishlistId) => {
    console.log(cartId, products);

    try {
      let cart = await Cart.findOne({ _id: cartId });

      if (!cart) {
        throw { status: 400, message: "Cart not found" };
      }

      // Loop through each product and process
      for (const { productId, variantId, quantity } of products) {
        const product = await Product.findById(productId);

        if (!product) {
          throw {
            status: 400,
            message: `Product not found for ID: ${productId}`,
          };
        }

        const variant = product.variants.find(
          (v) => v._id.toString() === variantId
        );

        if (!variant) {
          throw {
            status: 400,
            message: `Variant not found for ID: ${variantId}`,
          };
        }

        const existingProduct = cart.products.find(
          (item) =>
            item.productId.toString() === productId &&
            item.variantId.toString() === variantId
        );

        // Check stock availability
        if (
          variant.stock <
          (existingProduct?.quantity || 0) + Number(quantity)
        ) {
          throw {
            status: 400,
            message: `Only ${variant.stock} stocks left for product ${productId}`,
          };
        }

        // Update or add product to the cart
        if (existingProduct) {
          existingProduct.quantity += Number(quantity);
        } else {
          cart.products.push({
            productId,
            variantId,
            quantity: Number(quantity),
          });
        }

        // Remove the product from the wishlist
        await removeProductsFromWishList(wishlistId, [
          { productId, variantId },
        ]);
      }

      await cart.save();

      // const details = await Promise.all(
      //   products.map(async ({ productId, variantId, quantity }) => {
      //     const product = await Product.findById(productId);
      //     const variant = product.variants.find(
      //       (v) => v._id.toString() === variantId
      //     );
      //     return {
      //       productDetails: {
      //         _id: productId,
      //         title: product.title,
      //       },
      //       variantId,
      //       variantDetails: {
      //         color: variant.color,
      //         image: variant.images[0].secure_url,
      //         price: variant.price,
      //         stock: variant.stock,
      //       },
      //       quantity: existingProduct ? existingProduct?.quantity : quantity,
      //     };
      //   })
      // );

      return; // Return details for all products added to the cart
    } catch (error) {
      console.log(error);

      throw error;
    }
  },
};
