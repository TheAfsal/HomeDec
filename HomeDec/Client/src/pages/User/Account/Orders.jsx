import React, { useEffect, useState } from 'react';
import { fetchUserOrders } from '../../../api/administrator/orderManagement';
import { Link } from 'react-router-dom';


const Orders = () => {

    const [orders, setOrders] = useState([])


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
                        <th className="p-4">Order #</th>
                        <th className="p-4">Order date</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Total</th>
                        <th className="p-4">Items</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order, index) => (
                        <tr key={index} className="w-full border-b hover:bg-gray-50">
                            <td className="p-4">
                                <Link to={`/account/orders/in-detail/${order._id}`} className="flex items-center w-full">
                                    {order?.orderLabel}
                                </Link>
                            </td>
                            <td className="p-4">
                                <Link to={`/account/orders/in-detail/${order._id}`} className="flex items-center w-full">
                                    {order?.dateOrdered?.toString().split('T')[0]}
                                </Link>
                            </td>
                            <td className="p-4">
                                <Link to={`/account/orders/in-detail/${order._id}`} className="flex items-center w-full">
                                    <div>
                                        {order?.orderItems?.some(item => item.status === ("Pending" || "Processing" || "On Hold" || "Shipping"))
                                            ? "In Progress"
                                            : "Completed"}
                                    </div>
                                </Link>
                            </td>
                            <td className="p-4">
                                <Link to={`/account/orders/in-detail/${order._id}`} className="flex items-center w-full">
                                    {order?.finalTotal}
                                </Link>
                            </td>
                            <td className="p-4">
                                <Link to={`/account/orders/in-detail/${order._id}`} className="flex items-center w-full">
                                    <div className="flex space-x-2">
                                        {order?.orderItems?.map((variant, i) => (
                                            <img key={i} src={variant.variantDetails.firstImage?.secure_url} alt="Product" className="w-12 h-12 rounded object-cover" />
                                        ))}
                                        {order?.orderItems?.length > 3 && <span>+{order?.orderItems?.length - 2}</span>}
                                    </div>
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>
        </div>
    );
};

export default Orders;
