import React from 'react';
import { FiShoppingCart } from 'react-icons/fi';
import { updateCartCount } from '../../../../api/administrator/cartManagement';
import { Link, useNavigate } from 'react-router-dom';
import { USER_ROUTES } from '../../../../config/routerConstants';
import { addProductToCart } from '../../../../redux/slices/cartSlice';
import { useDispatch } from 'react-redux';

const WishListItem = ({ imageUrl, name, price, oldPrice, rating, reviews, discount, productId, variantId, isChecked, onCheckboxChange, handleProductsToCart }) => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleCheckboxChange = () => {
        onCheckboxChange(productId, variantId, !isChecked);
    };


    return (
        <div className="bg-white rounded-lg relative w-64 h-80 hover:shadow-md hover:scale-105 duration-500 overflow-hidden flex flex-col justify-around" >
            <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => { e.stopPropagation(); handleCheckboxChange() }}
                className='absolute z-50 top-3 right-3 w-4 h-4'
            />
            <img src={imageUrl} alt={name} className="w-full object-contain rounded-t-md hover:scale-105 duration-500" />
            <div className='p-4' onClick={() => navigate(`/${USER_ROUTES.SHOP}/${productId}`)}>
                <div className="flex items-center mb-2 text-xs">
                    <span className="text-yellow-400 mr-1">⭐</span>
                    <span className="text-yellow-400 mr-1">⭐</span>
                    <span className="text-yellow-400 mr-1">⭐</span>
                    <span className="text-yellow-400 mr-1">⭐</span>
                    <span className="text-gray-600">{rating} ({reviews} reviews)</span>
                </div>
                <h2 className="text-md font-semibold mb-2">{name}</h2>
                <div className="flex items-center justify-between">
                    <div>
                        {oldPrice && <span className="text-gray-400 line-through">${oldPrice}</span>}
                        <span className="text-xl font-bold">${price}</span>
                    </div>
                    <div className='bg-order_card_background p-3 rounded-md hover:shadow-md duration-500 text-green_800 hover:bg-background_grey'
                        onClick={() => handleProductsToCart(productId, variantId, false)}
                    >
                        <FiShoppingCart size={20} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WishListItem;
