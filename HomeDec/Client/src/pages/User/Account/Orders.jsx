import React, { useEffect, useState } from 'react';
import { fetchUserOrders } from '../../../api/administrator/orderManagement';
import { useNavigate } from 'react-router-dom';
import { USER_ROUTES } from '../../../config/routerConstants';


const Orders = () => {

    const [orders, setOrders] = useState([])
    const navigate = useNavigate()


    useEffect(() => {
        const fetchMyOrders = async () => {
            const orders = await fetchUserOrders()
            setOrders(orders);
            console.log(orders);

        }
        fetchMyOrders()
    }, [])



    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Orders</h2>
                <div className="flex space-x-4">
                    <select className="border rounded p-2">
                        <option>Select status</option>
                    </select>
                    <select className="border rounded p-2">
                        <option>For all time</option>
                    </select>
                </div>
            </div>

            <table className="min-w-full table-auto ">
                <thead className="bg-gray-100 text-left">
                    <tr>
                        <th className="p-4">Items</th>
                        <th className="p-4">Order #</th>
                        <th className="p-4">Order date</th>
                        <th className="p-4">Total</th>
                        <th className="p-4">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order, index) => (
                        <tr key={index} className="w-full font-nunito border-b">

                            <td className="p-4">
                                {order?.orderItems?.map((variant, i) => (
                                    <div key={i} className='flex items-center gap-3 cursor-pointer hover:shadow-md hover:scale-110 duration-500 border rounded-md p-1 mt-3 justify-center hover:bg-green_50'
                                        onClick={() => navigate(`/${USER_ROUTES.SHOP}/${variant?.productId?._id}`)}>
                                        <img key={i} src={variant.variantDetails.firstImage?.secure_url} alt="Product" className="w-16 h-16 object-contain" />
                                        <div className='flex flex-col '>
                                            <p className='text-sm font-bold'>
                                                {variant?.productId?.title}
                                            </p>
                                            <p className='text-xs font-medium'>
                                                {variant?.variantDetails?.color} | {variant?.quantity}
                                            </p>

                                        </div>
                                    </div>
                                ))}
                                {order?.orderItems?.length > 3 && <span>+{order?.orderItems?.length - 2}</span>}
                            </td>
                            <td className="p-4 text-sm">
                                ORDER-{order?.orderLabel.toUpperCase()}
                            </td>
                            <td className="p-4 text-sm">
                                {order?.dateOrdered?.toString().split('T')[0]}
                            </td>
                            <td className="p-4">
                                {order?.finalAmount}
                            </td>

                            <td className="p-4">
                                <div className='flex gap-3 items-center'>
                                    {
                                        order?.payment.status !== "Completed"
                                            ? <div className={"w-28 px-2 py-2 text-center my-4 rounded-md text-xs border duration-500 hover:font-bold  bg-green_200 text-purple-800 cursor-pointer hover:bg-green_50"}
                                                onClick={() => navigate(`/${USER_ROUTES.CHECKOUT}/${order._id}`)}>
                                                Continue Order
                                            </div>
                                            : <div>
                                                {
                                                    order?.orderItems?.some(item => ["Pending", "Processing", "On Hold", "Shipping"].includes(item.status))
                                                        ?
                                                        <p className='w-28 px-2 py-2 text-center my-4 rounded-md text-xs border duration-500 font-boldtext-purple-800 bg-green_50'>
                                                            In Progress
                                                        </p>
                                                        :
                                                        <p className='w-28 px-2 py-2 text-center my-4 rounded-md text-xs border duration-500 font-bold  text-purple-800 bg-green_50'>
                                                            Completed
                                                        </p>
                                                }
                                            </div>
                                    }
                                    <div className={"w-28 px-2 py-2 text-center my-4 rounded-md text-sm hover:font-bold duration-500 border-2 text-purple-800 cursor-pointer hover:bg-gray-200"}
                                        onClick={() => navigate(`/${USER_ROUTES.ACCOUNT}/${USER_ROUTES.ORDER_DETAILS}/${order._id}`)}>
                                        View Details
                                    </div>
                                </div>
                            </td>
                        </tr>

                    ))}
                </tbody>

            </table>
        </div>
    );
};

export default Orders;
