const Product = require("../models/productModel");
const findBestOffer = require("./findBestOffer");

const calculateTotalAmount = async (orderItems) => {
  let total = 0;
  let totalDiscounts = 0;
  let orderCollection = [];

  for (const item of orderItems) {
    const product = await Product.findById(
      item?.productDetails?._id || item?.productId
    )
      .populate("offers") // Populate the product offers
      .populate({
        path: "subCategory",
        select: "offers",
        populate: {
          path: "offers",
          select: "discountType discountValue minPurchaseAmount expiryDate",
        },
      })
      .select("variants offers subCategory");

    if (product) {
      console.log(
        "Product with Subcategory Offers:",
        JSON.stringify(product, null, 2)
      ); // Debugging log

      const variant = product.variants.find(
        (v) => v._id.toString() === item.variantId.toString()
      );

      if (variant && variant.isActive) {
        // Check if there's enough stock
        if (variant.stock < item.quantity) {
          throw new Error(
            `Not enough stock for variant ${variant.color}. Available: ${variant.stock}, Requested: ${item.quantity}`
          );
        }

        const originalPrice = variant.price; // Store the original price
        let variantPrice = originalPrice; // Start with the original price
        const offers = product.offers || [];
        const subcategoryOffers = product.subCategory?.offers || []; // Fetch subcategory offers
        const allOffers = [...offers, ...subcategoryOffers];

        // Debugging log

        // Find the best offer for this variant's price
        const bestOffer = findBestOffer(allOffers, originalPrice);
        let discountAmount = 0;

        if (bestOffer) {
          if (bestOffer.discountType === "percentage") {
            const calculatedDiscount =
              (originalPrice * bestOffer.discountValue) / 100;
            discountAmount = Math.min(
              calculatedDiscount,
              bestOffer.maxDiscountAmount || Infinity
            );
          } else if (bestOffer.discountType === "fixed") {
            discountAmount = Math.min(
              bestOffer.discountValue,
              bestOffer.maxDiscountAmount || Infinity
            );
          }

          // Apply discount to the variant price
          variantPrice -= discountAmount; // Deduct the discount from the variant price
        } else {
        }

        total += originalPrice * item.quantity;
        totalDiscounts += discountAmount * item.quantity;

        orderCollection.push({
          productId: item?.productDetails?._id || item?.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          price: variantPrice,
          discount: discountAmount,
          bestOffer,
        });
      } else {
        throw new Error(
          `Variant with ID ${item.variantId} not found or inactive for product ${item.product}`
        );
      }
    } else {
      throw new Error(`Product with ID ${item.product} not found`);
    }
  }

  const finalAmount = total - totalDiscounts;

  return { total, totalDiscounts, finalAmount, orderCollection };
};

// const calculateTotalAmount = async (orderItems) => {
//   let total = 0;
//   let orderCollection = [];

//   for (const item of orderItems) {
//     const product = await Product.findById(
//       item?.productDetails?._id || item?.productId
//     ).select("variants");

//     if (product) {
//       const variant = product.variants.find(
//         (v) => v._id.toString() === item.variantId.toString()
//       );

//       if (variant) {
//         // Check if there's enough stock
//         if (variant.stock < item.quantity) {
//           throw new Error(
//             `Not enough stock for variant ${variant.color}. Available: ${variant.stock}, Requested: ${item.quantity}`
//           );
//         }

//         total += variant.price * item.quantity;
//         orderCollection.push({
//           productId: item?.productDetails?._id || item?.productId,
//           variantId: item.variantId,
//           quantity: item.quantity,
//           price: variant.price,
//         });
//       } else {
//         throw new Error(
//           `Variant with ID ${item.variantId} not found for product ${item.product}`
//         );
//       }
//     } else {
//       throw new Error(`Product with ID ${item.product} not found`);
//     }
//   }

//   return { total, orderCollection };
// };

// const calculateTotalAmount = async (orderItems) => {
//   let total = 0;
//   let orderCollection = [];

//   for (const item of orderItems) {
//     const product = await Product.findById(
//       item?.productDetails?._id || item?.productId
//     ).select("variants");

//     if (product) {
//       const variant = product.variants.find(
//         (v) => v._id.toString() === item.variantId.toString()
//       );

//       if (variant) {
//         total += variant.price * item.quantity;
//         orderCollection.push({
//           productId: item?.productDetails?._id || item?.productId,
//           variantId: item.variantId,
//           quantity: item.quantity,
//           price: variant.price,
//         });
//       } else {
//         throw new Error(
//           `Variant with ID ${item.variantId} not found for product ${item.product}`
//         );
//       }
//     } else {
//       throw new Error(`Product with ID ${item.product} not found`);
//     }
//   }

//   return { total, orderCollection };
// };

module.exports = calculateTotalAmount;
