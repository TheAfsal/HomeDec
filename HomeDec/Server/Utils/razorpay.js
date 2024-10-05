const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (amount) => {
  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt: "receipt#1",
  };

  try {
    console.log(amount);
    const order = await razorpay.orders.create(options);
    console.log(order);
    return order;
  } catch (error) {
    throw new Error("Order creation failed");
  }
};

module.exports = createOrder;
