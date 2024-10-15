const findBestOffer = (offers, price) => {
  console.log("--------------------------------");
  console.log(offers);
  console.log(price);

  let bestOffer = null;

  const calculateEffectivePrice = (offer) => {
    if (offer.discountType === "percentage") {
      return price * (1 - offer.discountValue / 100);
    } else if (offer.discountType === "fixed") {
      return price - offer.discountValue;
    }
    return price; // No discount
  };

  offers.forEach((offer) => {
    if (price >= offer?.minPurchaseAmount) {
      const effectivePrice = calculateEffectivePrice(offer);
      // Determine if this offer is the best one
      if (!bestOffer || effectivePrice < bestOffer.effectivePrice) {
        bestOffer = {
          discountType: offer.discountType,
          discountValue: offer.discountValue,
          minPurchaseAmount: offer.minPurchaseAmount,
          expiryDate: offer.expiryDate,
          effectivePrice, // Include calculated effective price
        };
      }
    }
  });

  console.log("bestOffer--------------");
  console.log(bestOffer);

  return bestOffer;
};

module.exports = findBestOffer;
