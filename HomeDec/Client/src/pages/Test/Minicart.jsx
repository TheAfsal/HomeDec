import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PiShoppingCartSimpleBold } from 'react-icons/pi';  // Your cart icon
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from '@/components/ui/sheet';  // Sheet components
import OfferPriceDisplay from '@/utils/calculateOfferPrice';  // Offer price component
import { Trash2 } from 'lucide-react';

const MiniCart = () => {
    const dispatch = useDispatch();
    let { cartItems } = useSelector(state => state.cart);
    const [miniCartOpen, setMiniCartOpen] = useState(false);

    cartItems = []

    console.log("cartItems");
    console.log(cartItems);

    // Toggle the mini cart sheet
    const toggleMiniCart = () => {
        setMiniCartOpen(prev => !prev);
    };

    const updateQuantity = async (item, quantity) => {
        try {
            const newCartItem = await updateCartCount(item.productDetails._id, item.variantId, quantity);
            // dispatch(addProductToCart(newCartItem));
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const deleteItem = async (item) => {
        try {
            await removeVariantFromCart(item.productDetails._id, item.variantId);
            // dispatch(removeProduct(item));  // Remove from Redux cart
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    return (
        <>
            {/* Trigger Button */}
            <Sheet>
                <SheetTrigger asChild>
                    <PiShoppingCartSimpleBold size={24} className="cursor-pointer" onClick={toggleMiniCart} />
                </SheetTrigger>

                {/* Mini Cart Sheet */}
                <SheetContent className="w-full sm:w-96 max-w-lg">
                    <SheetHeader>
                        <SheetTitle>Your Cart</SheetTitle>
                        <SheetDescription>Review your cart items before checking out.</SheetDescription>
                    </SheetHeader>

                    {/* Cart Items */}
                    <div className="space-y-4">
                        {cartItems.length === 0 ? (
                            <p className="text-center text-gray-500">Your cart is empty.</p>
                        ) : (
                            cartItems.map(item => (
                                <div key={item.id} className="border p-3 rounded-lg flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mb-2">
                                    {/* Image and Title */}
                                    <div className="flex items-center w-full md:w-1/3">
                                        <img src={item.variantDetails.image} alt={item.name} className="w-24 h-24 object-cover mr-4 rounded-lg" />
                                        <div>
                                            <div className="font-semibold text-sm">{item.productDetails.title}</div>
                                            <div className="text-gray-500 text-xs">Color: {item.variantDetails.color}</div>
                                        </div>
                                    </div>

                                    {/* Offer Price */}
                                    <div className="w-full md:w-1/4 py-4">
                                        <OfferPriceDisplay productPrice={item.variantDetails.price} offerDetails={item.productDetails.bestOffer} />
                                    </div>

                                    {/* Quantity Update */}
                                    <div className="w-full md:w-1/4 py-4 flex justify-center">
                                        <div className="flex justify-around items-center space-x-2 border-2 rounded-md p-1 w-28 h-10">
                                            <button
                                                onClick={() => updateQuantity(item, -1)}
                                                className="w-10 flex items-center justify-center hover:bg-background_grey rounded"
                                                disabled={item.quantity <= 1}
                                            >
                                                -
                                            </button>
                                            <p className="text-lg">{item.quantity}</p>
                                            <button
                                                onClick={() => updateQuantity(item, 1)}
                                                className="w-10 flex items-center justify-center hover:bg-background_grey rounded"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    {/* Total Price */}
                                    <div className="w-full md:w-1/4 py-4">
                                        {
                                            item?.productDetails?.offers?.length !== 0 && item?.variantDetails?.price >= item?.productDetails?.bestOffer?.minPurchaseAmount
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

                                    {/* Delete Item */}
                                    <div className="w-full md:w-1/12 py-4 text-right">
                                        <button
                                            className="hover:bg-green_600 p-3 rounded-full hover:text-white duration-200"
                                            onClick={() => deleteItem(item)}
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer / Close Button */}
                    <SheetFooter>
                        <SheetClose asChild>
                            <button className="bg-green-600 text-white p-2 rounded-md">Proceed to Checkout</button>
                        </SheetClose>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </>
    );
};

export default MiniCart;
