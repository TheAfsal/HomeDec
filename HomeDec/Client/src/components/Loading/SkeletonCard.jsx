import React from "react";

const SkeletonCard = () => (
    <div className="product-card skeleton-loader w-72 max-w-xs mx-auto rounded-lg space-y-3 ">
        <div className=" bg-gray-300 h-56 w-full rounded-lg animate-pulse"></div>
        <div className=" bg-gray-300 h-6 w-3/4 rounded animate-pulse"></div>
        <div className="bg-gray-300 h-6 w-full rounded animate-pulse"></div>
        <div className=" bg-gray-300 h-5 w-1/2 rounded animate-pulse mt-4"></div>
    </div>
);

export default SkeletonCard;
