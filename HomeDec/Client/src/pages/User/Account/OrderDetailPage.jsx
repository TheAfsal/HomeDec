import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { changeOrderStatusByUser, fetchOrder, generateInvoice, generateReturnOrCancelRequest } from '../../../api/administrator/orderManagement';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { USER_ROUTES } from '../../../config/routerConstants';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"


const OrderDetailPage = () => {

    const { orderId } = useParams()
    const navigate = useNavigate()
    const [order, setOrder] = useState({})
    const [refresh, setRefresh] = useState(false)

    useEffect(() => {
        const fetchDetailedOrder = async () => {
            const order = await fetchOrder(orderId)
            console.log(order[0]);
            setOrder(order[0]);

        }
        fetchDetailedOrder()
    }, [refresh])

    const isAllDelivered =
        order?.orderItems?.some(item => ["Pending", "Processing", "On Hold", "Shipping"].includes(item.status))
            ? "In Progress"
            : "Completed"


    const changeItemStatus = async (status, orderId, productId, variantId) => {
        console.log(orderId, productId, variantId);
        await changeOrderStatusByUser(status, orderId, productId, variantId)

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

    const downloadInvoice = async (orderId, productId, variantId) => {
        try {
            const pdfBlob = await generateInvoice(orderId, productId, variantId);

            // Create a blob URL and initiate the download
            const url = window.URL.createObjectURL(new Blob([pdfBlob], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Invoice-${orderId}.pdf`);  // Customize filename
            document.body.appendChild(link);
            link.click();
            link.remove();  // Clean up after download
        } catch (error) {
            console.error("Error downloading the invoice:", error);
            alert(error.message);  // Optionally alert the user
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-10 bg-white shadow-md rounded-lg">
            <Link to={`/${USER_ROUTES.ACCOUNT}/${USER_ROUTES.ORDERS}`}>
                <IoIosArrowRoundBack size={30} color='' />
            </Link>
            <h1 className="text-2xl font-bold my-10 text-green_800">Order Details</h1>
            <div className="mb-10 font-nunito">
                <div className='flex justify-between'>
                    <h2 className="text-md font-semibold font-roboto text-green_700">Shipping Information</h2>
                    <h2 className="text-md font-semibold font-roboto text-green_700 mr-10">{order?.dateOrdered?.toString().split('T')[0]}</h2>
                </div>
                {
                    !(order?.street && order?.city && order?.state && order?.postalCode && order?.country)
                        ? <p className='my-3'>Not Available</p>
                        : <>
                            <p>{order?.name}</p>
                            <p>{order?.street}, {order?.city}, {order?.state}, {order?.postalCode}, {order?.country}</p>
                            <p>Mobile: {order?.mobile}</p>
                        </>
                }
            </div>

            <div className="mb-4">
                <h2 className="text-md font-semibold text-green_700">Order Items</h2>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th className="p-4 text-left">Product</th>
                            <th className="p-4 text-left">Price</th>
                            <CompletedOrder paymentStatus={order?.payment?.status} >
                                <th className="p-4 text-left">Status</th>
                                <th className="p-4 text-left">Actions</th>
                            </CompletedOrder>

                        </tr>
                    </thead>
                    <tbody>
                        {order?.orderItems?.map((item, index) => (
                            <tr key={index} className="font-nunito">
                                <td className="p-4">
                                    {/* <img
                                        src={item.variantDetails.firstImage?.secure_url}
                                        alt="Product"
                                        className="w-12 h-12 rounded object-cover mr-4"
                                    />
                                    <span>{item.productId.title}</span> */}

                                    <div className='flex items-center gap-3 cursor-pointer  p-1 mt-3 justify-start'
                                        onClick={() => navigate(`/${USER_ROUTES.SHOP}/${item?.productId?._id}`)}>
                                        <img key={index} src={item.variantDetails.firstImage?.secure_url} alt="Product" className="w-16 h-16 object-contain" />
                                        <div className='flex flex-col '>
                                            <p className='text-sm font-bold'>
                                                {item.productId.title}
                                            </p>
                                            <p className='text-xs font-medium'>
                                                {item?.variantDetails?.color} | {item?.quantity}
                                            </p>
                                        </div>
                                    </div>

                                </td>
                                <td className="p-4">${item.price.toFixed(2)}</td>
                                <CompletedOrder paymentStatus={order?.payment?.status} >
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

                                            {/* onClick={() => changeItemStatus("Returned", order?._id, item?.productId?._id, item?.variantId)} */ }
                                            switch (item?.status) {
                                                case "Delivered":
                                                    buttonContent = (
                                                        <div className='flex gap-2'>
                                                            {console.log(order.dateOrdered)}
                                                            {console.log(new Date() - new Date(order.dateOrdered))}
                                                            {console.log((new Date() - new Date(order.dateOrdered)) <= 7 * 24 * 60 * 60 * 1000)}

                                                            {(Math.abs(new Date() - new Date(order.dateOrdered)) <= 7 * 24 * 60 * 60 * 1000) && (
                                                                <div>
                                                                    {((item?.isReturned || item?.isCancelled) && item.status === "Delivered") ? (
                                                                        <div className="w-36 px-2 py-2 text-center my-4 rounded-md text-xs border-2 bg-green_50 text-green_800 cursor-pointer">
                                                                            Request under process
                                                                        </div>
                                                                    ) : (
                                                                        <ReturnComponent buttonName={"Return"} order={order} selectedItem={item} refresh={refresh} setRefresh={setRefresh} />
                                                                    )}
                                                                </div>
                                                            )}

                                                            <div className={`w-36 px-2 py-2 text-center my-4 rounded-md text-xs hover:font-bold border-2 duration-500 bg-green_50 text-green_800 cursor-pointer`} onClick={() => downloadInvoice(order?._id, item?.productId?._id, item?.variantId)}>
                                                                Download Invoice
                                                            </div>
                                                        </div>
                                                    );
                                                    break;
                                                case "Pending":
                                                case "On Hold":
                                                case "Processing":
                                                    buttonContent = (
                                                        <div>
                                                            {(item?.isCancelled) ? (
                                                                <div className="w-36 px-2 py-2 text-center my-4 rounded-md text-xs border-2 bg-green_50 text-green_800 cursor-pointer">
                                                                    Request under process
                                                                </div>
                                                            ) : (
                                                                <ReturnComponent buttonName={"Cancel"} order={order} selectedItem={item} refresh={refresh} setRefresh={setRefresh} />
                                                            )}
                                                        </div>
                                                        // <div className={`${buttonStyles} bg-red-200 text-red-800 cursor-pointer`} onClick={() => changeItemStatus("Cancelled", order?._id, item?.productId?._id, item?.variantId)}>
                                                        //     Cancel
                                                        // </div>
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
                                </CompletedOrder>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-10 font-nunito text-md flex justify-between items-end">
                <div>
                    <h2 className="text-lg my-2 font-semibold font-roboto mr-20 text-green_700">Payment Details</h2>
                    <p >Payment Method: {order?.payment?.method.toUpperCase()}</p>
                    <p>Total Amount: ${order?.totalAmount?.toFixed(2)}</p>
                    <p>Shipping Charge: 50</p>
                    <p>Final Total: ${order?.finalAmount?.toFixed(2)}</p>
                </div>
                <div className="mb-6 flex gap-4 items-center">
                    <h2 className="text-md font-semibold text-green_700">Order Status</h2>
                    <div className={`font-bold flex items-center justify-center gap-1.5 font-nunito w-24 px-2 py-1 text-center rounded-md text-xs ${isAllDelivered ? "bg-green_100 text-green_700" : "bg-orange-700 text-white"} `}>
                        <div className='bg-white w-2 h-2 rounded-full'></div>
                        {isAllDelivered}
                    </div>
                </div>
            </div>
            {
                order?.payment?.status !== "Completed" &&
                <div className={"w-36 mt-10 px-2 py-2 text-center rounded-md text-sm hover:font-semibold duration-500 border-2 bg-green_500 text-white text-purple-800 cursor-pointer hover:bg-gray-400"}
                    onClick={() => navigate(`/${USER_ROUTES.CHECKOUT}/${order._id}`)}>
                    Proceed with Order
                </div>
            }
        </div >
    );
};

export default OrderDetailPage;



const CompletedOrder = ({ paymentStatus, children }) => {
    return (
        <>
            {paymentStatus === "Completed" && children}
        </>
    );
};



const ReturnComponent = ({ buttonName, order, selectedItem, refresh, setRefresh }) => {
    const [reason, setReason] = useState('');
    const [comments, setComments] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e, returnOrCancel) => {
        e.preventDefault();

        // Reset error message
        setError('');

        // Validation checks
        if (!reason) {
            setError('Please select a reason for return.');
            return;
        }

        // Log the values if validation passes
        console.log('Product: Luxury Sofa');
        console.log('Order ID: 123456');
        console.log('Reason for Return:', reason);
        console.log('Additional Comments:', comments);
        console.log('selectedItem:', selectedItem);
        console.log(order._id, selectedItem.productId._id, selectedItem.variantId, reason, comments);

        await generateReturnOrCancelRequest(order._id, selectedItem.productId._id, selectedItem.variantId, reason, comments, returnOrCancel)

        // Clear form values
        setReason('');
        setComments('');
        setRefresh((prev) => !prev)
    };

    return (
        <Dialog open={refresh} onOpenChange={setRefresh} >
            {
                buttonName === "Return"
                    ? <DialogTrigger className={`w-24 px-2 py-2 text-center my-4 rounded-md text-xs hover:font-bold border-2 duration-500 bg-green_50 cursor-pointer text-orange-500`}>
                        Return
                    </DialogTrigger>
                    : <DialogTrigger className={`w-24 px-2 py-2 text-center my-4 rounded-md text-xs hover:font-bold border duration-500 bg-red-200 text-red-800 cursor-pointer`}>
                        Cancel
                    </DialogTrigger>
            }

            <DialogContent className="sm:max-w-[425px] rounded-lg bg-white shadow-2xl p-6">
                <form onSubmit={(e) => handleSubmit(e, buttonName.toLowerCase())}>
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-gray-800">{buttonName} Product</DialogTitle>
                        <DialogDescription className="text-gray-600">
                            Please provide the details for your {buttonName} request below.
                        </DialogDescription>
                    </DialogHeader>

                    {error && (
                        <div className="mb-4 text-red-600">
                            {error}
                        </div>
                    )}

                    <div className="grid gap-6 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="product" className="text-right font-medium text-gray-700">
                                Product
                            </Label>
                            <Input id="product" value={selectedItem.productId.title} className="col-span-3 bg-gray-100" readOnly />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="orderId" className="text-right font-medium text-gray-700">
                                Order ID
                            </Label>
                            <Input id="orderId" value={order.orderLabel.toUpperCase()} className="col-span-3 bg-gray-100" readOnly />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="reason" className="text-right font-medium text-gray-700">
                                Reason for {buttonName}
                            </Label>
                            <select
                                id="reason"
                                className="col-span-3 border border-gray-300 rounded-md p-2"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                            >
                                <option value="">Select a reason...</option>
                                <option value="Damaged">Damaged</option>
                                <option value="Not as described">Not as described</option>
                                <option value="Wrong item">Wrong item</option>
                                <option value="Changed my mind">Changed my mind</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="comments" className="text-right font-medium text-gray-700">
                                Additional Comments
                            </Label>
                            <textarea
                                id="comments"
                                className="col-span-3 border border-gray-300 rounded-md p-2"
                                placeholder="Any additional details or comments..."
                                rows="3"
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="submit">Submit Return Request</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};






