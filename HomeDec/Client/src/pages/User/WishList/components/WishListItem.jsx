import React from 'react'
import { FiShoppingCart } from 'react-icons/fi';

const WishlistItem = ({ imageUrl, name, price, oldPrice, rating, reviews, discount }) => (
    <div className="bg-white rounded-lg relative w-64 h-80 hover:shadow-md hover:scale-105 duration-200 flex flex-col justify-around">
        <img src={imageUrl} alt={name} className="w-full object-contain rounded-t-md " />
        <div className='p-4 '>

            <div className="flex items-center mb-2 text-xs">
                <span className="text-yellow-400 mr-1">⭐</span>
                <span className="text-yellow-400 mr-1">⭐</span>
                <span className="text-yellow-400 mr-1">⭐</span>
                <span className="text-yellow-400 mr-1">⭐</span>
                <span className="text-gray-600">{rating} ({reviews} reviews)</span>
            </div>
            <h2 className="text-md font-semibold mb-2">{name}</h2>
            <div className="flex items-center justify-between ">
                <div>
                    {oldPrice && <span className="text-gray-400 line-through">${oldPrice}</span>}
                    <span className="text-xl font-bold">${price}</span>
                </div>
                <div className='bg-order_card_background p-3 rounded-md text-green_800 hover:bg-background_grey'>
                    <FiShoppingCart size={20} />
                </div>
            </div>
        </div>
    </div>
);

export default WishlistItem
