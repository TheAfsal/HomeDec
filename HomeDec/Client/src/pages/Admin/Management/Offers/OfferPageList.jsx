import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import IsAdmin from '../../../../components/Admin/IsAdmin';
import TableHeader from '../../../../components/Table/TableHeader';
import NoRecords from '../../../../components/Table/NoRecords';
import { TbLock, TbLockOpen } from 'react-icons/tb';
import { FiEdit3 } from 'react-icons/fi';
import AddOfferPage from './AddOfferPage';
import { listOffers, toggleOfferStatus } from '../../../../api/administrator/offerManagement';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OfferPageList = () => {

    const [addPopup, setAddPopup] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [offers, setOffers] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const { role } = useSelector((state) => state.auth)

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const list = await listOffers(role)
                console.log(list);
                setOffers(list);
            } catch (error) {
                console.error('Error fetching offers:', error);
            }
        };
        fetchOffers();
    }, [refresh]);

    const toggleStatus = async (id) => {
        try {
            await toggleOfferStatus(id)
            setRefresh((prev) => !prev)
            setToast(true, "Offer status updated")
        } catch (error) {
            setToast(false, 'Error in toggling', error?.message);
        }
    }

    function setToast(status, message) {
        if (status) toast.success(message)
        else toast.error(message)
    }


    return (
        <div className="p-8">
            <ToastContainer />
            {/* Popup Overlay To Add Coupon*/}
            {addPopup && (
                <AddOfferPage isOpen={addPopup} onClose={setAddPopup} offerData={addPopup} setRefresh={setRefresh} setToast={setToast} />
            )}
            <div className='flex justify-between'>
                <h1 className="text-2xl font-semibold mb-2 font-nunito">Offer Management</h1>
                <IsAdmin>
                    <button
                        type="submit"
                        className=" bg-green_700 text-white font-semibold py-2 px-4 mb-2 rounded-lg hover:bg-green_800 focus:outline-none focus:ring-2 focus:ring-green_500 focus:ring-opacity-50"
                        onClick={() => setAddPopup(true)}
                    >
                        Add New Offer
                    </button>
                </IsAdmin>
            </div>
            <hr className='mb-5' />
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border-gray-200 rounded-lg font-nunito">
                    <TableHeader headerContent={["TITLE", "DESCRIPTION", "TYPE", "VALUE", "MIN PURCHASE AMT", "MAX DISCOUNT AMT", "START", "EXPIRY", "USAGE LIMIT", "ACTION"]} />
                    <tbody>
                        {
                            offers.length ?
                                offers.map((offer, index) => (
                                    <tr key={index} className='text-center hover:bg-form_inputFeild_background_grey' onClick={() => setShowDetails(offer)}>
                                        <td className="px-6 py-4 border-b font-nunito text-sm text-left">{offer?.title}</td>
                                        <td className="px-6 py-4 border-b font-nunito text-sm text-left">{offer?.description}</td>
                                        <td className="px-6 py-4 border-b font-nunito text-sm text-left">{offer?.discountType}</td>
                                        <td className="px-6 py-4 border-b font-nunito text-sm">
                                            {offer?.discountType === "percentage" ? (
                                                `${offer?.discountValue}%`
                                            ) : (
                                                `₹${offer?.discountValue}`
                                            )}
                                        </td>

                                        <td className="px-6 py-4 border-b font-nunito text-sm">{offer?.minPurchaseAmount}</td>
                                        <td className="px-6 py-4 border-b font-nunito text-sm">{offer?.maxDiscountAmount}</td>
                                        <td className="px-6 py-4 border-b font-nunito text-sm">{offer?.startDate?.toString().split("T")[0]}</td>
                                        <td className="px-6 py-4 border-b font-nunito text-sm">{offer?.expiryDate?.toString().split("T")[0]}</td>
                                        <td className="px-6 py-4 border-b font-nunito text-sm">{offer?.usageLimit}</td>
                                        <td className="px-6 py-4 border-b font-nunito text-sm " onClick={(e) => e.stopPropagation()}>
                                            <div className='flex gap-2'>
                                                <IsAdmin>
                                                    <div
                                                        onClick={() => toggleStatus(offer._id)}
                                                        className={`${offer.isActive
                                                            ? 'bg-status_succes_background_green text-status_succes_text_green '
                                                            : 'bg-status_failed_text_red text-status_failed_background_red '
                                                            } rounded-md py-1 text-xs text-center pl-2 min-w-[70px] cursor-pointer`}
                                                    >
                                                        {
                                                            offer.isActive
                                                                ? <div className='flex items-center gap-2'><TbLock />Lock</div>
                                                                : <div className='flex items-center gap-1'><TbLockOpen />Unlock</div>

                                                        }
                                                    </div>
                                                    <span
                                                        className="bg-green_200 text-green_900 cursor-pointer rounded-md py-1.5 flex items-center text-xs text-center px-2"
                                                        onClick={() => setAddPopup({ ...offer, startDate: offer.startDate?.toString().split("T")[0], expiryDate: offer.expiryDate?.toString().split("T")[0] })}
                                                    >
                                                        <FiEdit3 />
                                                    </span>
                                                </IsAdmin>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <NoRecords />
                                )
                        }
                    </tbody>
                </table>
                {
                    showDetails &&
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" onClick={() => setShowDetails(false)}>
                        <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                            <div className='flex justify-between mb-5'>
                                <h2 className="text-2xl font-bold text-green_800">{showDetails?.title.toUpperCase()}</h2>
                                <button onClick={() => setShowDetails(false)} className="text-2xl font-bold text-gray-500 hover:text-gray-700 ">&times;</button>
                            </div>

                            <div className=" items-center mb-4">
                                <h2 className="text-xl font-semibold">Products</h2>
                                <hr className='my-2' />
                                <div className="flex flex-wrap gap-2">
                                    {Object.keys(showDetails.products).map(key => (
                                        <p
                                            key={key}
                                            className={`hover:shadow-md hover:scale-105 duration-150 font-bold flex items-center justify-center gap-1.5 font-nunito px-2 py-1 text-center rounded-md text-xs ${true ? "bg-green_100 text-green_700" : "bg-orange-700 text-white"}`}
                                        >
                                            {showDetails.products[key]}
                                        </p>
                                    ))}
                                </div>

                            </div>
                            <div className=" items-center mb-4">
                                <h2 className="text-xl font-bold">Categories</h2>
                                <hr className='my-2' />
                                <div className="flex flex-wrap gap-2">
                                    {Object.keys(showDetails.categories).map(key => (
                                        <p
                                            key={key}
                                            className={`hover:shadow-md hover:scale-105 duration-150 font-bold flex items-center justify-center gap-1.5 font-nunito px-2 py-1 text-center rounded-md text-xs ${true ? "bg-green_100 text-green_700" : "bg-orange-700 text-white"}`}
                                        >
                                            {showDetails.categories[key]}
                                        </p>
                                    ))}
                                </div>

                            </div>
                        </div >
                    </div >
                }
            </div>
        </div >
    )
}

export default OfferPageList
