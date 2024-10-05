import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createOrder } from '../../../../api/user/account'
import { USER_ROUTES } from '../../../../config/routerConstants';

const OrderSummary = ({ cartItems, subtotal, discount, tax, total, pushToast }) => {

    const navigate = useNavigate();

    const handleOrderCreation = async () => {
        try {
            const orderId = await createOrder(cartItems)
            console.log(orderId);
            navigate(`/shop/cart/checkout/${orderId}`)
            navigate(`/${USER_ROUTES.CHECKOUT}/${orderId}`)
        } catch (error) {
            console.log(error);

            pushToast(false, error.message)
        }
    }

    return (
        < div className="mt-6 w-2/6 gap-4" >
            <div className="col-span-4 bg-order_card_background p-6 rounded-lg shadow">
                <h2 className="text-lg font-bold mb-4">Order Summary</h2>
                <div className='flex gap-3 flex-wrap'>
                    {cartItems.map((item, index) => (
                        <img key={index} width={"80px"} height={"80px"} src={item.variantDetails.image} alt="item" className='shadow-2xl rounded-md' />
                    ))}
                </div>
                <hr className='my-4' />
                <div className="text-sm text-gray-500 mb-2">Subtotal ({cartItems.length} items): <span className="float-right">${subtotal.toFixed(2)}</span></div>
                <div className="text-sm text-gray-500 mb-2">Saving: <span className="float-right text-green-600">-${discount.toFixed(2)}</span></div>
                <div className="text-sm text-gray-500 mb-2">Tax collected: <span className="float-right">${tax.toFixed(2)}</span></div>
                <hr className='my-4' />
                <div className="text-sm font-semibold text-gray-900 my-8 flex items-center justify-between">Estimated total: <span className="font-bold text-2xl">${total.toFixed(2)}</span></div>
                <div onClick={handleOrderCreation}>
                    <button className="w-full bg-green_600 text-sm text-white py-2 rounded-md hover:bg-green_400">Proceed to checkout </button>
                </div>
            </div>
        </div >
    )
}

export default OrderSummary
