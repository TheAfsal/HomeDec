import React from 'react'
import { useDispatch } from 'react-redux';
import { addProductToCart, removeProduct } from '../../../../redux/slices/cartSlice';
import { removeVariantFromCart, updateCartCount } from '../../../../api/administrator/cartManagement';
import OfferPriceDisplay from '../../../../utils/calculateOfferPrice.jsx';

const CartItem = ({ item, pushToast }) => {

    const dispatch = useDispatch();

    const updateQuantity = async (quantity) => {
        try {
            const newCartItem = await updateCartCount(item.productDetails._id, item.variantId, quantity)
            console.log(newCartItem);
            dispatch(addProductToCart(newCartItem))
        } catch (error) {
            pushToast(false, error.message)
        }
    }

    const deleteItem = async () => {
        const removedItem = await removeVariantFromCart(item.productDetails._id, item.variantId)
        console.log(removedItem);
        dispatch(removeProduct(removedItem))
        pushToast(true, "Product removed from cart")
    }

    console.log(item);


    return (
        <tr key={item.id} className="border-t">
            <td className="py-7">
                <div className="flex items-center">
                    <img src={item.variantDetails.image} alt={item.name} className="w-16 h-16 object-cover mr-4" />
                    <div>
                        <div className="font-semibold text-sm">{item.productDetails.title}</div>
                        <div className=" text-gray-500 text-xs">Color: {item.variantDetails.color} | Model: {item.model}</div>
                    </div>
                </div>
            </td>
            <td className="py-4">
                {/* {
                    (item.productDetails.offers.length !== 0 && item.variantDetails.price >= item.productDetails.offers[0].minPurchaseAmount)
                        ?
                        <span className="font-nunito">
                            {
                                item.productDetails.offers[0].discountType === "fixed"
                                    ? `₹${item.variantDetails.price - item.productDetails.offers[0].discountValue}`
                                    : `₹${item.variantDetails.price - (item.variantDetails.price * (item.productDetails.offers[0].discountValue / 100))}`
                            }
                        </span>
                        : <span className="font-nunito">₹{item.variantDetails.price}</span>
                } */}
                <OfferPriceDisplay productPrice={item.variantDetails.price} offerDetails={item.productDetails.bestOffer} />
            </td>
            <td className="py-4">
                <div className="flex justify-around items-center space-x-2 border-2 rounded-md p-1 w-28 h-10 ">
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
            </td>
            {/* <td className="py-4">${item.variantDetails.price * item.quantity}</td> */}
            <td className="py-4">
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
                {/* <OfferPriceDisplay productPrice={item.variantDetails.price} offerDetails={item.productDetails.offers[0]} /> */}
            </td>
            <td className="py-4 text-right pr-6">
                <button className='border-2 rounded-md py-1 px-3' onClick={deleteItem}>×</button>
            </td>
        </tr>
    )
}

export default CartItem
