const verifyPayment = async (response) => {
  const { razorpay_payment_id, razorpay_order_id } = response;

  // Make a request to your server to verify the payment
  const res = await fetch("/api/verifyPayment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature: process.env.RAZORPAY_KEY_ID,
    }),
  });

  const data = await res.json();

  // return data; // Return success or failure response
};

module.exports = verifyPayment;
