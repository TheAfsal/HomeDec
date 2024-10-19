import React, { useState } from 'react';
import { changeOrderStatus, rejectCancelOrReturnOrder } from '../../../../../api/administrator/orderManagement';
import { Button } from "@/components/ui/button"

const OrderStatusModal = ({ expandStatus, closeModal, setOrderData }) => {
    const [selectedStatus, setSelectedStatus] = useState('');

    const statuses = ['Processing', 'On Hold', 'Cancelled', 'Shipping', 'Delivered'];
    const statusOrder = {
        'Processing': 1,
        'On Hold': 2,
        'Shipping': 4,
        'Delivered': 5,
        'Cancelled': 6
    };

    const selectStatus = (status) => {
        setSelectedStatus(status);
    };

    const handleApply = async () => {
        try {

            console.log('Selected Status:', selectedStatus);
            console.log(expandStatus._id);
            console.log(expandStatus.orderItems.productId);
            console.log(expandStatus.orderItems.variantId);
            const updatedOrder = await changeOrderStatus(selectedStatus, expandStatus?._id, expandStatus?.orderItems?.productId, expandStatus?.orderItems?.variantId)
            console.log(updatedOrder.order.orderItems);
            console.log(updatedOrder.orderId);

            setOrderData((prev) => {
                const updatedOrders = prev.map((order) => {
                    console.log(order);

                    const updatedItem = updatedOrder.order.orderItems.find(
                        (item) =>
                            item.productId === order.orderItems.productId &&
                            item.variantId === order.orderItems.variantId &&
                            updatedOrder.orderId === order._id
                    );

                    if (updatedItem) {
                        return {
                            ...order,
                            orderItems: {
                                ...order.orderItems,
                                status: updatedItem.status, // Set the new status
                            },
                        };
                    }
                    // If no match, return the order as is
                    return order;
                });
                // Return updated state
                return updatedOrders;
            });
            closeModal()

        } catch (error) {
            console.log(error);

        }
    };

    const handleReturnOrCancel = async (status) => {
        try {
            const updatedOrder = await changeOrderStatus(status, expandStatus?._id, expandStatus?.orderItems?.productId, expandStatus?.orderItems?.variantId)
            console.log(updatedOrder.order.orderItems);
            console.log(updatedOrder.orderId);

            setOrderData((prev) => {
                const updatedOrders = prev.map((order) => {

                    const updatedItem = updatedOrder.order.orderItems.find(
                        (item) =>
                            item.productId === order.orderItems.productId &&
                            item.variantId === order.orderItems.variantId &&
                            updatedOrder.orderId === order._id
                    );

                    if (updatedItem) {
                        return {
                            ...order,
                            orderItems: {
                                ...order.orderItems,
                                status: updatedItem.status,
                            },
                        };
                    }
                    return order;
                });
                return updatedOrders;
            });
            closeModal()

        } catch (error) {
            console.log(error);

        }
    };

    const rejectCancelOrReturn = async () => {
        await rejectCancelOrReturnOrder(expandStatus?._id, expandStatus?.orderItems?.productId, expandStatus?.orderItems?.variantId)
        closeModal()
    }



    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" onClick={closeModal}>
            <div className="bg-white rounded-lg p-6 w-96" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-lg font-semibold mb-4">Select Order Status</h2>
                <div className="flex justify-around flex-wrap">
                    {statuses.map((status, index) => (
                        <button
                            key={status}
                            disabled={index + 1 <= statusOrder[expandStatus?.orderItems?.status] ? true : false}
                            className={`px-4 py-2 m-1 rounded-full border ${selectedStatus === status
                                ? 'bg-green-200 text-green-800 border-green-600'
                                : index + 1 <= statusOrder[expandStatus?.orderItems?.status]
                                    ? 'bg-white text-gray-400 border-gray-400'
                                    : 'bg-white text-gray-800 border-gray-400'
                                }`}
                            onClick={() => selectStatus(status)}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                <p className="text-xs mt-4 text-gray-500">*You can choose only one Order status</p>
                {
                    (expandStatus.orderItems.isCancelled || expandStatus.orderItems.isReturned) &&
                    <div className='border p-2 rounded-md'>
                        {
                            ((expandStatus.orderItems.isCancelled || expandStatus.orderItems.isReturned) && expandStatus.orderItems.status !== "Returned") ?
                                <p className="text-xs text-gray-500 font-bold">
                                    Arrived a {expandStatus.orderItems.isCancelled ? "Cancel" : "Return"} Request
                                </p>
                                :
                                <p className="text-xs text-gray-500 font-bold">
                                    Product {expandStatus.orderItems.isCancelled ? "Cancelled" : "Returned"}
                                </p>
                        }
                        <p className="text-xs text-gray-500 font-semibold">Reason: {expandStatus?.orderItems?.reason?.type}</p>
                        <p className="text-xs text-gray-500">{expandStatus?.orderItems?.reason?.comments}</p>

                        {
                            ((expandStatus.orderItems.isCancelled || expandStatus.orderItems.isReturned) && expandStatus.orderItems.status !== "Returned") &&
                            <div className="flex justify-end space-x-2 mt-2">
                                <Button
                                    className="bg-green-500 text-white hover:bg-green-600"
                                    onClick={() => expandStatus.orderItems.isCancelled ? handleReturnOrCancel("Cancelled") : handleReturnOrCancel("Returned")}
                                >
                                    Approve
                                </Button>
                                <Button
                                    className="bg-red-500 text-white hover:bg-red-600"
                                    onClick={rejectCancelOrReturn}
                                >
                                    Reject
                                </Button>
                            </div>
                        }
                    </div>
                }



                {/* Apply Button */}
                <button className="mt-6 px-4 py-2 w-full bg-green-600 text-white rounded-lg" onClick={handleApply}>
                    Apply Now
                </button>
            </div>
        </div>
    );
};

export default OrderStatusModal;
