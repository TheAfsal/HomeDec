import React from 'react'
import { useDispatch } from 'react-redux';
import { addProductToCart, removeProduct } from '../../../../redux/slices/cartSlice';
import { removeVariantFromCart, updateCartCount } from '../../../../api/administrator/cartManagement';
import OfferPriceDisplay from '../../../../utils/calculateOfferPrice.jsx';
import { Trash2 } from 'lucide-react';

const CartItem = ({ item, pushToast }) => {

    const dispatch = useDispatch();

    const updateQuantity = async (quantity) => {
        try {
            const newCartItem = await updateCartCount(item.productDetails._id, item.variantId, quantity)
            dispatch(addProductToCart(newCartItem))
        } catch (error) {
            pushToast(false, error.message)
        }
    }

    const deleteItem = async () => {
        const removedItem = await removeVariantFromCart(item.productDetails._id, item.variantId)
        dispatch(removeProduct(removedItem))
        pushToast(true, "Product removed from cart")
    }




    return (
        <div key={item.id} className="border p-3 rounded-lg flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mb-2">
            <div className="flex items-center w-full md:w-1/3">
                <img src={item.variantDetails.image} alt={item.name} className="w-24 h-24 object-cover mr-4 rounded-lg" />
                <div>
                    <div className="font-semibold text-sm">{item.productDetails.title}</div>
                    <div className="text-gray-500 text-xs">Color: {item.variantDetails.color}</div>
                </div>
            </div>

            <div className="w-full md:w-1/4 py-4">
                <OfferPriceDisplay productPrice={item.variantDetails.price} offerDetails={item.productDetails.bestOffer} />
            </div>

            <div className="w-full md:w-1/4 py-4 flex justify-center">
                <div className="flex justify-around items-center space-x-2 border-2 rounded-md p-1 w-28 h-10">
                    <button
                        onClick={() => updateQuantity(-1)}
                        className="w-10 flex items-center justify-center hover:bg-background_grey rounded"
                        disabled={item.quantity <= 1}
                    >
                        -
                    </button>
                    <p className="text-lg">{item.quantity}</p>
                    <button
                        onClick={() => updateQuantity(1)}
                        className="w-10 flex items-center justify-center hover:bg-background_grey rounded"
                    >
                        +
                    </button>
                </div>
            </div>

            <div className="w-full md:w-1/4 py-4">
                {
                    (item?.productDetails?.offers?.length !== 0 && item?.variantDetails?.price >= item?.productDetails?.bestOffer?.minPurchaseAmount)
                        ?
                        <span className="font-nunito">
                            {
                                item?.productDetails?.bestOffer?.discountType === "fixed"
                                    ? `₹${(item?.variantDetails?.price - item?.productDetails?.bestOffer?.discountValue) * item?.quantity}`
                                    : `₹${(item?.variantDetails?.price - (item?.variantDetails?.price * (item?.productDetails?.bestOffer?.discountValue / 100))) * item?.quantity}`
                            }
                        </span>
                        : <span className="font-nunito">₹{item.variantDetails.price * item.quantity}</span>
                }
            </div>

            <div className="w-full md:w-1/12 py-4 text-right">
                <button className='hover:bg-green_600 p-3 rounded-full hover:text-white duration-200' onClick={deleteItem}><Trash2 size={20} /></button>
            </div>
        </div>

    )
}

export default CartItem
