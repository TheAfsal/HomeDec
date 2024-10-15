const OfferPriceDisplay = ( productPrice, offerDetails ) => {
  console.log(productPrice);
  console.log(offerDetails);

  if (
    offerDetails !== null &&
    productPrice >= offerDetails?.minPurchaseAmount
  ) {
    return offerDetails.discountType === "fixed"
      ? `${productPrice - offerDetails.discountValue}`
      : `${productPrice - productPrice * (offerDetails.discountValue / 100)}`;
  } else {
    return productPrice;
  }
};

export default OfferPriceDisplay;
