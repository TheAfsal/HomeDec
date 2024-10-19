import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import IsAdmin from '../../../../components/Admin/IsAdmin';
import TableHeader from '../../../../components/Table/TableHeader';
import NoRecords from '../../../../components/Table/NoRecords';
import AddCouponPage from './AddCouponPage';
import { listCoupons, toggleCouponStatus } from '../../../../api/administrator/couponManagement';
import { TbLock, TbLockOpen } from 'react-icons/tb';
import { FiEdit3 } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const CouponListPage = () => {

    const [addPopup, setAddPopup] = useState(false);
    const [coupons, setCoupons] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const { role } = useSelector((state) => state.auth)

    useEffect(() => {
        const addCategories = async () => {
            try {
                const list = await listCoupons(role)
                setCoupons(list);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        addCategories();
    }, [refresh]);

    const toggleStatus = async (id) => {
        try {
            await toggleCouponStatus(id)
            setRefresh((prev) => !prev)
            setToast(true, "Coupon status updated")
        } catch (error) {
            console.log('Error in toggling', error);
            setToast(false, "Error in toggling Coupon status")
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
                <AddCouponPage isOpen={addPopup} onClose={setAddPopup} couponData={addPopup} setRefresh={setRefresh} setToast={setToast} />
            )}
            <div className='flex justify-between'>
                <h1 className="text-2xl font-semibold mb-2 font-nunito">Coupon Management</h1>
                <IsAdmin>
                    <button
                        type="submit"
                        className=" bg-green_700 text-white font-semibold py-2 px-4 mb-2 rounded-lg hover:bg-green_800 focus:outline-none focus:ring-2 focus:ring-green_500 focus:ring-opacity-50"
                        onClick={() => setAddPopup(true)}
                    >
                        Add New Coupon
                    </button>
                </IsAdmin>
            </div>
            <hr className='mb-5' />
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border-gray-200 rounded-lg font-nunito">
                    <TableHeader headerContent={["CODE", "TYPE", "VALUE", "MIN PURCHASE AMT", "MAX DISCOUNT AMT", "EXPIRY", "USAGE LIMIT", "USER LIMIT", role === "admin" && "ACTION"]} />
                    <tbody>
                        {
                            coupons.length ?
                                coupons.map((coupon, index) => (
                                    <tr key={index} className='text-center'>
                                        <td className="px-6 py-4 border-b font-nunito text-sm text-left">{coupon?.code}</td>
                                        <td className="px-6 py-4 border-b font-nunito text-sm text-left">{coupon?.discountType}</td>
                                        <td className="px-6 py-4 border-b font-nunito text-sm">
                                            {coupon?.discountType === "percentage" ? (
                                                `${coupon?.discountValue}%`
                                            ) : (
                                                `₹${coupon?.discountValue}`
                                            )}
                                        </td>

                                        <td className="px-6 py-4 border-b font-nunito text-sm">{coupon?.minPurchaseAmount}</td>
                                        <td className="px-6 py-4 border-b font-nunito text-sm">{coupon?.maxDiscountAmount}</td>
                                        <td className="px-6 py-4 border-b font-nunito text-sm">{coupon?.expiryDate?.toString().split("T")[0]}</td>
                                        <td className="px-6 py-4 border-b font-nunito text-sm">{coupon?.usageLimit}</td>
                                        <td className="px-6 py-4 border-b font-nunito text-sm">{coupon?.userLimit}</td>
                                        <IsAdmin>

                                            <td className="px-6 py-4 border-b font-nunito text-sm flex gap-2">
                                                <div
                                                    onClick={() => toggleStatus(coupon._id)}
                                                    className={`${coupon.isActive
                                                        ? 'bg-status_succes_background_green text-status_succes_text_green '
                                                        : 'bg-status_failed_text_red text-status_failed_background_red '
                                                        } rounded-md py-1 text-xs text-center pl-2 min-w-[70px] cursor-pointer`}
                                                >
                                                    {
                                                        coupon.isActive
                                                            ? <div className='flex items-center gap-2'><TbLock />Lock</div>
                                                            : <div className='flex items-center gap-1'><TbLockOpen />Unlock</div>

                                                    }
                                                </div>
                                                <span
                                                    className="bg-green_200 text-green_900 cursor-pointer rounded-md py-1.5 flex items-center text-xs text-center px-2"
                                                    onClick={() => setAddPopup({ ...coupon, expiryDate: coupon.expiryDate?.toString().split("T")[0] })}
                                                >
                                                    <FiEdit3 />
                                                </span>
                                            </td>
                                        </IsAdmin>
                                    </tr>
                                )) : (
                                    <NoRecords />
                                )
                        }
                    </tbody>
                </table>
            </div>
        </div >
    )
}

export default CouponListPage
