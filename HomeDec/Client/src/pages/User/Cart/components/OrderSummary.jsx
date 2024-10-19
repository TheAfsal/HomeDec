import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createOrder, verifyPromoCode } from '../../../../api/user/account';
import { AUTH_ROUTES, USER_ROUTES } from '../../../../config/routerConstants';
import OfferPriceDisplay from '../../../../utils/calculateOfferPrice';
import { useSelector } from 'react-redux';

const OrderSummary = ({ cartItems, pushToast }) => {
    const navigate = useNavigate();
    const [showInput, setShowInput] = useState(false);
    const [promoCode, setPromoCode] = useState('');
    const [approvedPromoCode, setApprovedPromoCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [finalAmount, setFinalAmount] = useState(0);
    const { role } = useSelector((state) => state.auth)

    const subtotal = cartItems.reduce((acc, item) =>
        acc + (item.variantDetails.price * item.quantity), 0
    );

    const tax = 0; // Replace with actual tax calculation if needed
    const total = subtotal + tax;
    const deliveryCharge = cartItems.length ? 50 : 0

    // Calculate final amount based on discounts
    useEffect(() => {
        let tempDiscount = subtotal - cartItems.reduce((acc, item) => acc + (OfferPriceDisplay(item.variantDetails.price, item.productDetails.bestOffer) * item.quantity), 0)
        setFinalAmount(total - tempDiscount + deliveryCharge);
        setDiscount(tempDiscount)
    }, [total, promoCode]);



    const handleApply = async () => {
        try {
            const promoDetails = await verifyPromoCode(promoCode, cartItems, finalAmount);
            setApprovedPromoCode(promoDetails)

            let discountValue = 0;
            if (promoDetails.discountType === 'percentage') {
                discountValue = (subtotal * promoDetails.discountValue) / 100;
            } else if (promoDetails.discountType === 'fixed') {
                discountValue = promoDetails.discountValue;
            }

            const newFinalAmount = subtotal - (discount + discountValue) + tax;
            // setDiscount(discount + discountValue);
            // setFinalAmount(newFinalAmount);
            setShowInput(false);
        } catch (error) {
            console.log(error);

            pushToast(false, error.message);
        }
    };


    const handleOrderCreation = async () => {
        try {
            console.log(cartItems);

            const orderId = await createOrder(cartItems, approvedPromoCode);
            console.log(orderId);
            navigate(`/${USER_ROUTES.CHECKOUT}/${orderId}`);
        } catch (error) {
            console.log(error);
            pushToast(false, error.message);
        }
    };

    const handleRemovePromoCode = () => {
        setPromoCode('');
        setApprovedPromoCode('');
        // setDiscount(0);
        // setFinalAmount(total);
    };

    return (
        <div className='w-2/6'>
            <div className="mt-6 gap-4">
                <div className="col-span-4 bg-order_card_background p-6 rounded-lg shadow">
                    <h2 className="text-lg font-bold mb-4">Order Summary</h2>
                    <div className='flex gap-3 flex-wrap'>
                        {cartItems.map((item, index) => (
                            <img key={index} width={"80px"} height={"80px"} src={item.variantDetails.image} alt="item" className='shadow-2xl rounded-md' />
                        ))}
                    </div>
                    <hr className='my-4' />
                    <div className="text-sm text-gray-500 mb-2">Subtotal ({cartItems.length} items): <span className="float-right">₹{subtotal?.toFixed(2)}</span></div>
                    <div className="text-sm text-gray-500 mb-2">Saving: <span className="float-right text-green-600">-₹{discount?.toFixed(2)}</span></div>
                    {
                        approvedPromoCode &&
                        <div className="text-sm text-gray-500 mb-2">Applied coupon discount: <span className="float-right text-green-600">-{approvedPromoCode?.discountValue?.toFixed(2)}{approvedPromoCode?.discountType === "percentage" ? "%" : ""}</span></div>
                    }
                    <div className="text-sm text-gray-500 mb-2">Tax collected: <span className="float-right">₹{tax?.toFixed(2)}</span></div>
                    <div className="text-sm text-gray-500 mb-2">Delivery fee (fixed):  <span className="float-right">₹{deliveryCharge?.toFixed(2)}</span></div>
                    <hr className='my-4' />
                    <div className="text-sm font-semibold text-gray-900 my-8 flex items-center justify-between">
                        Estimated total:
                        <span className="font-bold text-2xl">
                            ₹{
                                approvedPromoCode
                                    ? (approvedPromoCode.discountType === "fixed"
                                        ? (finalAmount - approvedPromoCode.discountValue).toFixed(2)
                                        : (finalAmount * (1 - approvedPromoCode.discountValue / 100)).toFixed(2)
                                    )
                                    : finalAmount.toFixed(2)
                            }
                        </span>
                    </div>


                    <button className="w-full bg-green_600 text-sm text-white py-2 rounded-md hover:bg-green_400" onClick={() => role !== "user" ? navigate(`/${AUTH_ROUTES.LOGIN_USER}`) : handleOrderCreation()}>Proceed to checkout</button>

                </div>
            </div>
            <div className='flex flex-col w-full mt-3 h-16 justify-center bg-order_card_background p-6 rounded-lg shadow font-nunito'>
                {!showInput ? (
                    <div className='flex justify-between items-center'>
                        {promoCode ? <p>{`${promoCode} Promo Code Applied`}</p> : <p>% Apply Promo Code</p>}
                        <button
                            className='rounded-lg px-3 py-1 text-2xl hover:bg-green_500 hover:text-white'
                            onClick={() => setShowInput(true)}
                        >
                            {promoCode ? <div onClick={handleRemovePromoCode} >x</div> : "+"}
                        </button>
                    </div>
                ) : (
                    <div className='flex items-center'>
                        <input
                            type='text'
                            placeholder='Enter Promo Code'
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            className='border rounded-lg p-2 flex-grow mr-2'
                        />
                        <button
                            className='bg-green_500 text-white rounded-lg px-4 py-2'
                            onClick={() => role !== "user" ? navigate(`/${AUTH_ROUTES.LOGIN_USER}`) : handleApply()}
                        >
                            Apply
                        </button>
                    </div>
                )}
            </div>
        </div >
    );
};

export default OrderSummary;
