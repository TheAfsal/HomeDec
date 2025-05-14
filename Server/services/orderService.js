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
const PDFDocument = require("pdfkit");
const blobStream = require("blob-stream");

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

      //Add Delivary Charge = 50
      finalAmount += 50;

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

      if (finalAmount > 1000 && paymentMethod === "cod") {
        throw {
          status: 500,
          message: "Orders above ₹1000 cannot be placed using Cash on Delivery",
        };
      }

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
          //
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
            totalDiscounts += couponDoc.discountValue;
            finalAmount -= couponDoc.discountValue;
          } else {
            const discountAmount =
              finalAmount * (couponDoc.discountValue / 100);
            totalDiscounts += discountAmount;
            finalAmount -= discountAmount;
          }
          // }
        }

        orderUpdates.finalAmount = finalAmount;

        // Save the updated user document
        await user.save();
      } else {
      }

      // Step 5: Payment Methods
      if (paymentMethod === "online") {
        try {
          orderId = await createOrder(finalAmount);

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
        } catch (error) {
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
            status: "Completed",
          };

          console.log(
            "User wallet balance updated successfully:",
            updatedBalance
          );
        } catch (error) {
          throw { status: 500, message: error.message };
        }
      } else if (paymentMethod === "cod") {
        orderUpdates.payment = {
          method: "cod",
          transactionId: null,
          status: "Completed",
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

      return { orderId, paymentMethod, updatedOrder };
    } catch (error) {
      if (error.status) throw error;
      else throw { status: 400, message: "order creation failed" };
    }
  },

  addTransactionId: async (
    userId,
    orderId,
    razorpayPaymentId,
    paymentStatus
  ) => {
    try {
      const transactionDoc = await Transaction.findOne({ orderId, userId });

      if (!transactionDoc) {
        throw { status: 404, message: "Transaction not found for this order." };
      }

      // Step 2: Update the transaction document with the Razorpay payment ID
      transactionDoc.transactionId = razorpayPaymentId;
      transactionDoc.paymentStatus = paymentStatus ? "Completed" : "Failed";
      transactionDoc.paymentDate = new Date();

      await Order.updateOne(
        { _id: orderId },
        {
          "payment.status": paymentStatus ? "Completed" : "Failed",
        }
      );

      // Step 3: Save the updated transaction document
      await transactionDoc.save();
      console.log(
        "Transaction updated with Razorpay payment ID:",
        transactionDoc
      );
    } catch (error) {
      throw new Error("Failed to fetch Orders");
    }
  },

  ListOrdersForAdmin: async () => {
    try {
      const orderList = await Order.find({
        "payment.method": { $ne: "pending" },
      })
        .populate("userId", "firstName") // Populate user name
        .populate("orderItems.productId", "title");
      return orderList;
    } catch (error) {
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
          $unwind: "$orderItems",
        },
        {
          $lookup: {
            from: "products",
            localField: "orderItems.productId",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        {
          $unwind: "$productDetails",
        },
        {
          $match: {
            "productDetails.sellerId": new mongoose.Types.ObjectId(sellerId),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
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
            "productDetails.variants": 1,
            dateOrdered: 1,
            totalAmount: 1,
            shippingCharge: 1,
            city: 1,
            state: 1,
            country: 1,
            postalCode: 1,
            street: 1,
            orderLabel: 1,
            "orderItems.isCancelled": 1,
            "orderItems.isReturned": 1,
            "orderItems.reason": 1,
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
        firstName: order.userDetails.firstName,
        orderItems: order.orderItems,
        shippingCharge: order.shippingCharge,
        totalAmount: order.totalAmount,
        dateOrdered: order.dateOrdered,
        orderLabel: order.orderLabel,
        city: order.city,
        state: order.state,
        country: order.country,
        postalCode: order.postalCode,
        street: order.street,
        productDetails: order.productDetails,
        variantDetails: order.variantDetails,
      }));

      return formattedResults;
    } catch (error) {
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

      if (status === "Cancelled" && order.payment.method === "online") {
        const user = await User.findOne({ _id: order.userId });

        user.walletBalance += orderItem.price;

        user.save();
        // Create a new wallet transaction
        const walletHistory = new Wallet({
          userId: user._id,
          amount: orderItem.price,
          transactionType: "credit",
          orderId: order._id,
        });

        // Save the wallet transaction
        await walletHistory.save();
      }

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

  requestReturnOrcancel: async (
    orderId,
    productId,
    variantId,
    reason,
    comments,
    returnOrCancel
  ) => {
    try {
      // Find the order
      const order = await Order.findById(orderId);

      if (!order) {
        throw new Error("Order not found");
      }

      if (returnOrCancel === "return") {
        // Check if the order is delivered
        const isDelivered = order.orderItems.some(
          (item) => item.status === "Delivered"
        );

        if (isDelivered) {
          const deliveryDate = new Date(order.updatedAt); // Assuming updatedAt reflects the delivery date
          const now = new Date();

          // Calculate the difference in time
          const timeDifference = now - deliveryDate; // in milliseconds
          const daysDifference = timeDifference / (1000 * 3600 * 24); // convert to days

          if (daysDifference > 7) {
            throw new Error(
              "Returns are not accepted after one week from delivery."
            );
          }
        }

        // Proceed to update the order with return request details
        const updateData = {
          $set: {
            "orderItems.$[item].isReturned": true,
            "orderItems.$[item].reason": {
              type: reason,
              comments,
            },
          },
        };

        const updatedOrder = await Order.findByIdAndUpdate(
          orderId,
          updateData,
          {
            new: true,
            arrayFilters: [
              { "item.productId": productId, "item.variantId": variantId },
            ],
          } // Target specific items in the array
        );

        if (!updatedOrder) {
          throw new Error("Order update failed");
        }

        return updatedOrder;
      } else if (returnOrCancel === "cancel") {
        // Check if the order is delivered
        const isDelivered = order.orderItems.some(
          (item) => item.status === "Delivered"
        );

        if (isDelivered) {
          throw new Error("Product already delivered");
        }

        // Proceed to update the order with return request details
        const updateData = {
          $set: {
            "orderItems.$[item].isCancelled": true,
            "orderItems.$[item].reason": {
              type: reason,
              comments,
            },
          },
        };

        const updatedOrder = await Order.findByIdAndUpdate(
          orderId,
          updateData,
          {
            new: true,
            arrayFilters: [
              { "item.productId": productId, "item.variantId": variantId },
            ],
          } // Target specific items in the array
        );

        if (!updatedOrder) {
          throw new Error("Order update failed");
        }

        return updatedOrder;
      }
    } catch (error) {
      console.error("Error requesting return:", error);
      throw error; // Rethrow or handle the error as needed
    }
  },

  rejectCancelOrReturn: async (orderId, productId, variantId) => {
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
      orderItem.isCancelled = false;
      orderItem.isReturned = false;
      orderItem.reason = {};

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
      const orders = await Order.find({ userId })
        .populate("orderItems.productId")
        .sort({ createdAt: -1 });

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
      throw new Error("Failed to fetch Orders");
    }
  },

  generateInvoice: async (userId, orderId, productId, variantId, res) => {
    try {
      const doc = new PDFDocument();

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="invoice-${orderId}.pdf"`
      );

      doc.pipe(res);

      const user = await User.findOne({ _id: userId });

      const order = await Order.findOne({ _id: orderId, userId })
        .populate("orderItems.productId")
        .populate({
          path: "orderItems.productId",
          populate: [{ path: "category" }, { path: "subCategory" }],
        });
      if (!order) throw new Error("Order not found");

      // Step 2: Find the specific product item
      const orderItem = order.orderItems.find(
        (item) =>
          item.productId._id.equals(productId) &&
          item.variantId.equals(variantId)
      );
      if (!orderItem) throw new Error("Order item not found");

      const product = orderItem.productId;
      const variant = product.variants.find((v) => v._id.equals(variantId));

      // Prepare invoice details
      const invoiceDetails = {
        orderId: orderId,
        user: {
          name: `${user.firstName} ${user.lastName}`, // Use the actual user's name
          email: user.email, // Replace with actual user's email if available
          mobile: order.mobile,
          address: {
            street: order.street,
            city: order.city,
            state: order.state,
            postalCode: order.postalCode,
            country: order.country,
          },
        },
        products: [
          {
            title: product.title,
            price: orderItem.price,
            quantity: orderItem.quantity,
            variant: variant
              ? {
                  color: variant.color,
                  image: variant.images[0].secure_url,
                }
              : null,
            category: product.category.name, // Assuming category is populated
            subCategory: product.subCategory.name, // Assuming subCategory is populated
          },
        ],
        totalAmount: orderItem.price * orderItem.quantity,
      };

      doc.moveDown();

      // Add company name
      doc.fontSize(30).text("HomeDec", { align: "center" });
      doc.fontSize(25).text("Invoice", { align: "center" });
      doc.moveDown();

      // Add invoice details
      doc.fontSize(12).text(`Order ID: ${invoiceDetails.orderId}`);
      doc.text(`Customer: ${invoiceDetails.user.name}`);
      doc.text(`Email: ${invoiceDetails.user.email}`);
      doc.text(`Mobile: ${invoiceDetails.user.mobile || "Not Found"}`);
      doc.text(
        `Address: ${invoiceDetails.user.address.street}, ${invoiceDetails.user.address.city}, ${invoiceDetails.user.address.state}, ${invoiceDetails.user.address.postalCode}, ${invoiceDetails.user.address.country}`
      );
      doc.moveDown();

      // Add a table-like structure for products
      doc.fontSize(14).text("Products", { underline: true });
      doc.moveDown();

      invoiceDetails.products.forEach((product) => {
        doc.fontSize(12).text(`Product: ${product.title}`, { continued: true });
        doc.text(
          `  |  Price: ${product.price} rupees  |  Quantity: ${product.quantity}`
        );

        if (product.variant) {
          doc.text(`  |  Color: ${product.variant.color} `);
        }
        doc.text(`  |  Category: ${product.category}`);
        doc.text(`  |  Subcategory: ${product.subCategory}`);
        doc.moveDown();
      });

      // Add total amount in a highlighted manner
      doc.fontSize(16).text(`Total Amount: ${invoiceDetails.totalAmount}`, {
        underline: true,
      });
      doc.moveDown();

      // Add a footer or thank you note
      doc
        .fontSize(12)
        .text("Thank you for your business!", { align: "center" });

      // Finalize the PDF document
      doc.end();
    } catch (error) {
      // Only send a response if headers have not been sent
      if (!res.headersSent) {
        return res.status(500).json({ message: "Failed to generate Invoice" });
      }
    }
  },

  getTop10: async () => {
    try {
      const result = await Order.aggregate([
        { $unwind: "$orderItems" },
        {
          $lookup: {
            from: "products",
            localField: "orderItems.productId",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        { $unwind: "$productDetails" },
        {
          $facet: {
            topSellingProducts: [
              {
                $group: {
                  _id: "$productDetails._id",
                  productName: { $first: "$productDetails.title" },
                  image: {
                    $first: {
                      $arrayElemAt: [
                        "$productDetails.variants.images.secure_url",
                        0,
                      ],
                    },
                  },
                  totalQuantity: { $sum: "$orderItems.quantity" },
                },
              },
              { $sort: { totalQuantity: -1 } },
              { $limit: 10 },
            ],
            topSellingCategories: [
              {
                $group: {
                  _id: "$productDetails.category",
                  totalQuantity: { $sum: "$orderItems.quantity" },
                },
              },
              {
                $lookup: {
                  from: "categories",
                  localField: "_id",
                  foreignField: "_id",
                  as: "categoryDetails",
                },
              },
              { $unwind: "$categoryDetails" },
              {
                $project: {
                  categoryId: "$_id",
                  categoryName: "$categoryDetails.name",
                  totalQuantity: 1,
                },
              },
              { $sort: { totalQuantity: -1 } },
              { $limit: 10 },
            ],
            topSellingSubCategories: [
              {
                $group: {
                  _id: "$productDetails.subCategory",
                  totalQuantity: { $sum: "$orderItems.quantity" },
                },
              },
              {
                $lookup: {
                  from: "subcategories",
                  localField: "_id",
                  foreignField: "_id",
                  as: "subCategoryDetails",
                },
              },
              { $unwind: "$subCategoryDetails" },
              {
                $project: {
                  subCategoryId: "$_id",
                  subCategoryName: "$subCategoryDetails.name",
                  totalQuantity: 1,
                },
              },
              { $sort: { totalQuantity: -1 } },
              { $limit: 10 },
            ],
          },
        },
      ]);

      return result[0]; // Access the results from the facets
    } catch (error) {
      console.error("Error fetching best-selling products:", error);
      throw new Error("Failed to fetch best-selling products");
    }
  },
};
