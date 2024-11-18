import React from "react";

const OfferPriceDisplay = ({ productPrice, offerDetails }) => {
  // 
  // 

  if (
    offerDetails !== undefined &&
    productPrice >= offerDetails?.minPurchaseAmount
  ) {
    return (
      <div className="flex gap-2 font-nunito">
        <span className="text-gray-400 line-through flex items-center">
          <span className="text-lg font-bold">₹{productPrice}</span>
        </span>
        <span className="text-2xl font-bold font-nunito">
          {offerDetails.discountType === "fixed"
            ? `₹${productPrice - offerDetails.discountValue}`
            : `₹${productPrice -
            productPrice * (offerDetails.discountValue / 100)
            }`}
        </span>
      </div>
    );
  } else {
    return (
      <span className="text-2xl font-bold font-nunito">₹{productPrice}</span>
    );
  }
};

export default OfferPriceDisplay;
