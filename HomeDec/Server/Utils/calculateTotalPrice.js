const Product = require("../models/productModel");

const calculateTotalAmount = async (orderItems) => {
  let total = 0;
  let orderCollection = [];

  for (const item of orderItems) {
    const product = await Product.findById(
      item?.productDetails?._id || item?.productId
    ).select("variants"); // Fetch product variants

    if (product) {
      const variant = product.variants.find(
        (v) => v._id.toString() === item.variantId.toString()
      );

      if (variant) {
        total += variant.price * item.quantity;
        orderCollection.push({
          productId: item?.productDetails?._id || item?.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          price: variant.price,
        });
      } else {
        throw new Error(
          `Variant with ID ${item.variantId} not found for product ${item.product}`
        );
      }
    } else {
      throw new Error(`Product with ID ${item.product} not found`);
    }
  }

  return { total, orderCollection };
};

module.exports = calculateTotalAmount;
