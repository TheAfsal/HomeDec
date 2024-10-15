const { default: mongoose } = require("mongoose");
const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");
const calculateTotalAmount = require("../Utils/calculateTotalPrice");
const generateOrderLabel = require("../Utils/generateOrderLabel");
const Product = require("../models/productModel");
const createOrder = require("../Utils/razorpay");
const Transaction = require("../models/transactionModel");
const { getCurrentWalletBalance } = require("./walletService");
const Wallet = require("../models/walletTransaction");
const User = require("../models/userModel");
const Coupon = require("../models/couponModel");

module.exports = {
  AddNewOrder: async (userId, cartItems, promoCode) => {
    try {
      const { total, totalDiscounts, finalAmount, orderCollection } =
        await calculateTotalAmount(cartItems);
      const orderLabel = generateOrderLabel();

      const order = new Order({
        orderItems: orderCollection,
        totalAmount: total,
        discountApplied: totalDiscounts,
        finalAmount: !promoCode.discountType
          ? finalAmount
          : promoCode.discountType === "fixed"
          ? (finalAmount - promoCode.discountValue).toFixed(2)
          : (finalAmount * (1 - promoCode.discountValue / 100)).toFixed(2),
        userId,
        orderLabel,
      });

      if (Object.keys(promoCode).length !== 0) {
        order.couponsApplied = {
          couponId: promoCode.couponId,
          // discountAmount: promoCode.discountValue,
          discountType: promoCode.discountType,
          discountAmount:
            promoCode.discountType === "fixed"
              ? promoCode.discountValue.toFixed(2)
              : finalAmount -
                finalAmount * (1 - promoCode.discountValue / 100).toFixed(2),
        };
      }

      await order.save();
      return { orderId: order._id };
    } catch (error) {
      console.log(error);
      throw new Error("Error creating order: " + error.message);
    }
  },

  updateExistingOrder: async (
    _id,
    shippingAddress,
    paymentMethod,
    userId,
    cartId
  ) => {
    try {
      // Step 1: Retrieve the existing order
      const orderDoc = await Order.findOne({ _id });
      if (!orderDoc) {
        throw { status: 400, message: "Order not found" };
      }

      // Step 2: Calculate totals
      let { total, totalDiscounts, finalAmount, orderCollection } =
        await calculateTotalAmount(orderDoc.orderItems);

      // Step 3: Prepare updates
      const orderUpdates = {
        orderItems: orderCollection,
        totalAmount: total,
        discountApplied: totalDiscounts,
        finalAmount: finalAmount,
        street: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country,
        userId,
      };

      let orderId;

      // Step 4: Handle Coupons
      if (orderDoc.couponsApplied && orderDoc.couponsApplied.length > 0) {
        const user = await User.findById(userId);
        if (!user) {
          throw { status: 400, message: "User not found" };
        }

        for (const coupon of orderDoc.couponsApplied) {
          const couponId = coupon.couponId;
          const couponDoc = await Coupon.findById(couponId);

          if (!couponDoc) {
            console.log(`Coupon not found: ${couponId}`);
            continue; // Skip if the coupon doesn't exist
          }

          // Validate the coupon
          if (
            !couponDoc.isValid() ||
            couponDoc.isUsageLimitExceeded(
              await Coupon.countDocuments({ _id: couponId })
            )
          ) {
            console.log(
              `Coupon is invalid or usage limit exceeded: ${coupon.code}`
            );
            continue;
          }

          const userUsageCount = user.couponsApplied.filter((appliedCoupon) =>
            appliedCoupon.couponId.equals(couponId)
          ).length;

          // if (couponDoc.isUserLimitExceeded(userUsageCount)) {
          //   console.log(`User usage limit exceeded for coupon: ${coupon.code}`);
          //   continue;
          // }

          // Reduce the coupon usage count if applicable
          if (couponDoc.usageLimit !== null) {
            couponDoc.usageLimit -= 1; // Decrease the usage count
            await couponDoc.save(); // Save the updated coupon document
          }

          // Apply coupon to user
          // const alreadyApplied = user.couponsApplied.filter((appliedCoupon) =>
          //   appliedCoupon.couponId.equals(couponId)
          // );

          // if (!alreadyApplied) {
          user.couponsApplied.push({
            couponId: couponId,
            dateApplied: new Date(),
            discountAmount: coupon.discountAmount,
            discountType: coupon.discountType,
          });

          // Apply discount
          if (couponDoc.discountType === "fixed") {
            console.log("value2", couponDoc.discountValue);

            totalDiscounts += couponDoc.discountValue;
            finalAmount -= couponDoc.discountValue;
          } else {
            console.log("value1", couponDoc.discountValue);
            const discountAmount =
              finalAmount * (couponDoc.discountValue / 100);
            totalDiscounts += discountAmount;
            finalAmount -= discountAmount;
          }
          // }
        }

        console.log("totalDiscounts", totalDiscounts);
        console.log("finalAmount", finalAmount);
        orderUpdates.finalAmount = finalAmount;

        // Save the updated user document
        await user.save();
        console.log("Promo codes added to user successfully.");
      } else {
        console.log("No coupons applied to the order.");
      }

      // Step 5: Payment Methods
      if (paymentMethod === "online") {
        try {
          console.log("finalAmount", finalAmount);
          console.log("!!!!!!");
          orderId = await createOrder(finalAmount);
          console.log("Online Order ID:", orderId);

          const transactionDoc = new Transaction({
            userId,
            orderId: _id,
            transactionId: `txn_${Date.now()}`,
            amount: finalAmount,
          });

          await transactionDoc.save();
          orderUpdates.payment = {
            method: "online",
            transactionId: transactionDoc._id,
          };
          console.log("Transaction saved successfully:", transactionDoc);
        } catch (error) {
          console.log(error);
          throw { status: 500, message: error.message };
        }
      } else if (paymentMethod === "wallet") {
        try {
          const currentWalletBalance = await getCurrentWalletBalance(userId);

          // Check if the current wallet balance is sufficient
          if (currentWalletBalance < finalAmount) {
            throw { status: 400, message: "Insufficient Wallet balance" };
          }

          const walletTransactionDoc = new Wallet({
            userId,
            amount: finalAmount,
            transactionType: "debit",
            orderId: _id,
            payment: {
              method: "wallet",
              details: {
                transactionId: `txn_wallet_${Date.now()}`,
                walletBalanceAfter: currentWalletBalance - finalAmount,
                transactionDate: new Date(),
              },
            },
          });

          await walletTransactionDoc.save();
          console.log(
            "Wallet transaction saved successfully:",
            walletTransactionDoc
          );

          const updatedBalance = currentWalletBalance - finalAmount;

          await User.findByIdAndUpdate(
            userId,
            { walletBalance: updatedBalance },
            { new: true }
          );
          orderUpdates.payment = {
            method: "wallet",
            transactionId: walletTransactionDoc._id,
          };

          console.log(
            "User wallet balance updated successfully:",
            updatedBalance
          );
        } catch (error) {
          console.log(error);
          throw { status: 500, message: error.message };
        }
      } else if (paymentMethod === "cod") {
        orderUpdates.payment = {
          method: "cod",
          transactionId: null,
        };
      }

      // Step 6: Update the existing order
      const updatedOrder = await Order.findByIdAndUpdate(_id, orderUpdates, {
        new: true,
        runValidators: true,
      });

      // Step 7: Decrement the stock for each product variant in the order
      for (const item of orderCollection) {
        const { productId, variantId, quantity } = item;
        const product = await Product.findById(productId);

        if (product) {
          const variant = product.variants.id(variantId);
          if (variant && variant.stock >= quantity) {
            variant.stock -= quantity;
            await product.save();
          } else {
            throw {
              status: 400,
              message: "Insufficient stock for product variant",
            };
          }
        } else {
          throw { status: 400, message: "Product not found" };
        }
      }

      // Step 8: Empty Cart
      const cart = await Cart.findById({ _id: cartId });
      cart.products = [];
      await cart.save();

      console.log("Order updated successfully:", updatedOrder);

      return { orderId, paymentMethod, updatedOrder };
    } catch (error) {
      if (error.status) throw error;
      else throw { status: 400, message: "order creation failed" };
    }
  },

  addTransactionId: async (userId, orderId, razorpayPaymentId) => {
    try {
      console.log(orderId, userId, razorpayPaymentId);

      const transactionDoc = await Transaction.findOne({ orderId, userId });

      if (!transactionDoc) {
        throw { status: 404, message: "Transaction not found for this order." };
      }

      // Step 2: Update the transaction document with the Razorpay payment ID
      transactionDoc.transactionId = razorpayPaymentId; // Store Razorpay payment ID
      transactionDoc.paymentStatus = "Completed"; // Update payment status
      transactionDoc.paymentDate = new Date(); // Update payment date

      // Step 3: Save the updated transaction document
      await transactionDoc.save();
      console.log(
        "Transaction updated with Razorpay payment ID:",
        transactionDoc
      );
    } catch (error) {
      console.log(error);
      throw new Error("Failed to fetch Orders");
    }
  },

  ListOrdersForAdmin: async () => {
    try {
      const orderList = await Order.find({ "payment.method": { $ne: "pending" } })
        .populate("userId", "firstName") // Populate user name
        .populate("orderItems.productId", "title");
      return orderList;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to fetch Orders");
    }
  },

  ListOrdersForSeller: async (sellerId) => {
    try {
      const orderList = await Order.aggregate([
        {
          $match: { "payment.method": { $ne: "pending" } },
        },
        {
          $unwind: "$orderItems", // Deconstruct orderItems array
        },
        {
          $lookup: {
            from: "products", // Name of the Products collection
            localField: "orderItems.productId", // Field in orders
            foreignField: "_id", // Field in products
            as: "productDetails",
          },
        },
        {
          $unwind: "$productDetails", // Deconstruct productDetails array
        },
        {
          $match: {
            "productDetails.sellerId": new mongoose.Types.ObjectId(sellerId), // Filter by seller ID
          },
        },
        {
          $lookup: {
            from: "users", // Name of the Users collection
            localField: "userId", // Field in orders
            foreignField: "_id", // Field in users
            as: "userDetails",
          },
        },
        {
          $unwind: "$userDetails", // Deconstruct userDetails array
        },
        {
          $project: {
            _id: 1,
            userId: 1,
            "orderItems.productId": 1,
            "orderItems.variantId": 1,
            "orderItems.quantity": 1,
            "orderItems.price": 1,
            "orderItems.status": 1,
            "productDetails.title": 1,
            "productDetails.variants": 1, // Include the entire variants array
            dateOrdered: 1,
            totalAmount: 1,
            shippingCharge: 1,
            city: 1,
            state: 1,
            country: 1,
            postalCode: 1,
            street: 1,
            "userDetails.firstName": 1, // Only include firstName
          },
        },
      ]);

      // Process to extract the specific variant based on variantId
      const finalResults = orderList.map((order) => {
        const variantDetails = order.productDetails.variants.find(
          (variant) =>
            variant._id.toString() === order.orderItems.variantId.toString()
        );

        return {
          ...order,
          variantDetails: variantDetails || null, // Include variant details or null if not found
        };
      });

      // Format the result to include only user firstName
      const formattedResults = finalResults.map((order) => ({
        _id: order._id,
        userId: order.userId,
        firstName: order.userDetails.firstName, // Extract firstName directly
        orderItems: order.orderItems,
        shippingCharge: order.shippingCharge,
        totalAmount: order.totalAmount,
        dateOrdered: order.dateOrdered,
        city: order.city,
        state: order.state,
        country: order.country,
        postalCode: order.postalCode,
        street: order.street,
        productDetails: order.productDetails,
        variantDetails: order.variantDetails,
      }));

      console.log(formattedResults);
      return formattedResults;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to fetch Orders");
    }
  },

  changeOrderStatus: async (status, orderId, productId, variantId) => {
    try {
      // Find the order by orderId
      const order = await Order.findById(orderId);

      if (!order) {
        throw { status: 404, message: "Order not found" };
      }

      // Find the product in the order and update its status
      const orderItem = order.orderItems.find(
        (item) =>
          item.productId.toString() === productId &&
          item.variantId.toString() === variantId
      );

      if (!orderItem) {
        throw {
          status: 404,
          message: "Product or variant not found in this order",
        };
      }

      // Update the status of the found order item
      orderItem.status = status;

      // Save the updated order
      await order.save();

      return {
        message: "Order status updated successfully",
        orderId: order._id,
        order,
      };
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  },

  listOrdersForUser: async (userId) => {
    try {
      // Step 1: Fetch orders for the user
      const orders = await Order.find({ userId }).populate(
        "orderItems.productId"
      );

      // Step 2: Enrich order items with variant details
      const enrichedOrders = await Promise.all(
        orders.map(async (order) => {
          const enrichedOrderItems = await Promise.all(
            order.orderItems.map(async (item) => {
              const product = item.productId;

              // Step 3: Find the corresponding variant
              const variant = product.variants.find((variant) =>
                variant._id.equals(item.variantId)
              );

              // Prepare the simplified variant details
              const simplifiedVariantDetails = variant
                ? {
                    color: variant.color,
                    firstImage: variant.images[0], // Only include the first image
                  }
                : null; // If variant not found, return null

              // Return enriched order item with simplified product details and variant details
              return {
                productId: {
                  _id: product._id,
                  title: product.title,
                },
                variantId: item.variantId,
                quantity: item.quantity,
                price: item.price,
                isCancelled: item.isCancelled,
                isReturned: item.isReturned,
                status: item.status,
                variantDetails: simplifiedVariantDetails, // Simplified variant details
              };
            })
          );

          return {
            ...order.toObject(),
            orderItems: enrichedOrderItems,
          };
        })
      );

      return enrichedOrders;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to fetch Orders");
    }
  },

  OrderDetail: async (userId, OrderDetail) => {
    try {
      // Step 1: Fetch orders for the user
      const orders = await Order.find({ _id: OrderDetail, userId }).populate(
        "orderItems.productId"
      );

      // Step 2: Enrich order items with variant details
      const enrichedOrders = await Promise.all(
        orders.map(async (order) => {
          const enrichedOrderItems = await Promise.all(
            order.orderItems.map(async (item) => {
              const product = item.productId;

              // Step 3: Find the corresponding variant
              const variant = product.variants.find((variant) =>
                variant._id.equals(item.variantId)
              );

              // Prepare the simplified variant details
              const simplifiedVariantDetails = variant
                ? {
                    color: variant.color,
                    firstImage: variant.images[0], // Only include the first image
                  }
                : null; // If variant not found, return null

              // Return enriched order item with simplified product details and variant details
              return {
                productId: {
                  _id: product._id,
                  title: product.title,
                },
                variantId: item.variantId,
                quantity: item.quantity,
                price: item.price,
                isCancelled: item.isCancelled,
                isReturned: item.isReturned,
                status: item.status,
                variantDetails: simplifiedVariantDetails, // Simplified variant details
              };
            })
          );

          return {
            ...order.toObject(),
            orderItems: enrichedOrderItems,
          };
        })
      );

      return enrichedOrders;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to fetch Orders");
    }
  },
};
