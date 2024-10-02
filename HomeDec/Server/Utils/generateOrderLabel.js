function generateOrderLabel() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let orderId = "";

  for (let i = 0; i < 7; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    orderId += characters[randomIndex];
  }

  return orderId;
}

module.exports = generateOrderLabel;
