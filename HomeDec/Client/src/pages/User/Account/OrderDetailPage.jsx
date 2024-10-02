import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { changeOrderStatusByUser, fetchOrder } from '../../../api/administrator/orderManagement';
import { IoIosArrowRoundBack } from 'react-icons/io';

const OrderDetailPage = () => {

    const { orderId } = useParams()
    const [order, setOrder] = useState({})

    useEffect(() => {
        const fetchDetailedOrder = async () => {
            const order = await fetchOrder(orderId)
            setOrder(order[0]);
            console.log(order);

        }
        fetchDetailedOrder()
    }, [])

    const isAllDelivered =
        order?.orderItems?.some(item => item.status === ("Pending" || "Processing" || "On Hold" || "Shipping"))
            ? "In Progress"
            : "Completed"


    const changeItemStatus = async (status, orderId, productId, variantId) => {
        console.log(orderId, productId, variantId);
        const returnedItem = await changeOrderStatusByUser(status, orderId, productId, variantId)
        console.log(returnedItem);
        setOrder(prevOrder => {
            // Clone the existing order to avoid direct mutation
            const updatedOrder = { ...prevOrder };

            // Update the order items
            updatedOrder.orderItems = updatedOrder.orderItems.map(item => {
                // Check if this item matches the returned item
                if (item.productId._id === productId && item.variantId === variantId) {
                    return {
                        ...item,
                        status, // Update status
                        isReturned: true,   // Mark as returned
                    };
                }
                return item;
            });

            // Optionally update the timestamp
            updatedOrder.updatedAt = new Date().toISOString();

            return updatedOrder; // Return the updated order
        });
    }

    return (
        <div className="max-w-5xl mx-auto p-10 bg-white shadow-md rounded-lg">
            <Link to={"/account/orders"}>
                <IoIosArrowRoundBack size={30} color='' />
            </Link>
            <h1 className="text-2xl font-bold my-4 text-green_800">Order Details</h1>
            <div className="mb-4 font-nunito">
                <div className='flex justify-between'>
                    <h2 className="text-md font-semibold font-roboto text-green_700">Shipping Information</h2>
                    <h2 className="text-md font-semibold font-roboto text-green_700 mr-10">{order?.dateOrdered?.toString().split('T')[0]}</h2>
                </div>
                <p>{order?.name}</p>
                <p>{order?.street}, {order?.city}, {order?.state}, {order?.postalCode}, {order?.country}</p>
                <p>Mobile: {order?.mobile}</p>
            </div>
            <div className="mb-4">
                <h2 className="text-md font-semibold text-green_700">Order Items</h2>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th className="p-4 text-left">Product</th>
                            <th className="p-4 text-left">Quantity</th>
                            <th className="p-4 text-left">Price</th>
                            <th className="p-4 text-left">Status</th>
                            <th className="p-4 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order?.orderItems?.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-100 font-nunito">
                                <td className="p-4">
                                    <Link to={`/shop/${item?.productId?._id}`} className='flex items-center'>
                                        <img
                                            src={item.variantDetails.firstImage?.secure_url}
                                            alt="Product"
                                            className="w-12 h-12 rounded object-cover mr-4"
                                        />
                                        <span>{item.productId.title}</span>
                                    </Link>
                                </td>
                                <td className="p-4">{item.quantity}</td>
                                <td className="p-4">${item.price.toFixed(2)}</td>
                                <td className="p-4">
                                    <div key={index} className={`w-24 px-2 py-2 text-center my-4 rounded-md text-xs ${item?.status === 'Delivered' ? 'bg-green-200 text-green-800' :
                                        item?.status === 'Processing' ? 'bg-violet-200 text-purple-800' :
                                            item?.status === 'Cancelled' ? 'bg-red-200 text-red-800' :
                                                item?.status === 'On Hold' ? 'bg-orange-200 text-orange-800' :
                                                    item?.status === 'Pending' ? ' border border-slate-700 text-red-800' :
                                                        item?.status === 'Returned' ? 'bg-orange-700 text-white' :
                                                            'bg-blue-200 text-blue-800'
                                        }`}>
                                        {item?.status}
                                    </div>
                                </td>
                                <td>
                                    {(() => {
                                        const buttonStyles = `w-24 px-2 py-2 text-center my-4 rounded-md text-xs`;
                                        let buttonContent;

                                        switch (item?.status) {
                                            case "Delivered":
                                                buttonContent = (
                                                    <div className={`${buttonStyles} bg-yellow-100 text-orange-700 cursor-pointer`} onClick={() => changeItemStatus("Returned", order?._id, item?.productId?._id, item?.variantId)}>
                                                        Return
                                                    </div>
                                                );
                                                break;
                                            case "Pending":
                                            case "On Hold":
                                            case "Processing":
                                                buttonContent = (
                                                    <div className={`${buttonStyles} bg-red-200 text-red-800 cursor-pointer`} onClick={() => changeItemStatus("Cancelled", order?._id, item?.productId?._id, item?.variantId)}>
                                                        Cancel
                                                    </div>
                                                );
                                                break;

                                            case "Shipping":
                                                buttonContent = (
                                                    <div className={`${buttonStyles} bg-gray-200 text-gray-800`}>
                                                        Item dispatched
                                                    </div>
                                                );
                                                break;
                                            case "Cancelled":
                                            case "Returned":
                                                buttonContent = (
                                                    <div className={`${buttonStyles} bg-gray-200 text-gray-800`}>
                                                        Order Completed
                                                    </div>
                                                );
                                                break;

                                            default:
                                                buttonContent = null; // No button for other statuses
                                                break;
                                        }

                                        return buttonContent;
                                    })()}
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-4 font-nunito text-md flex justify-between items-end">
                <div>
                    <h2 className="text-lg my-2 font-semibold font-roboto mr-20 text-green_700">Payment Details</h2>
                    <p >Payment Method: {order?.paymentMethod?.toUpperCase()}</p>
                    <p>Total Amount: ${order?.totalAmount?.toFixed(2)}</p>
                    <p>Shipping Charge: ${order?.shippingCharge?.toFixed(2)}</p>
                    <p>Final Total: ${order?.finalTotal?.toFixed(2)}</p>
                </div>
                <div className="mb-6 flex gap-4 items-center">
                    <h2 className="text-md font-semibold text-green_700">Order Status</h2>
                    <p className={`font-bold flex items-center justify-center gap-1.5 font-nunito w-24 px-2 py-1 text-center rounded-md text-xs ${isAllDelivered ? "bg-green_100 text-green_700" : "bg-orange-700 text-white"} `}>
                        <div className='bg-white w-2 h-2 rounded-full'></div>
                        {isAllDelivered}
                    </p>
                </div>
            </div>
        </div >
    );
};

export default OrderDetailPage;
