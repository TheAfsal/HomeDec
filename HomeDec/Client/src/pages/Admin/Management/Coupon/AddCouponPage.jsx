import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { createCoupon, updateCoupon } from '../../../../api/administrator/couponManagement';

const AddCouponPage = ({ isOpen, onClose, couponData, setRefresh, setToast }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    useEffect(() => {


        // Cleanup function
        return () => {

        };
    }, []);


    useEffect(() => {

        if (isOpen && couponData !== true) {
            // Reset form fields to coupon data when the modal is opened for editing
            reset(couponData);
        }
    }, [isOpen, couponData, reset]);

    const onSubmit = async (data) => {

        try {
            if (couponData !== true) {
                await updateCoupon(data)
                setToast(true, "Coupon updated successfully")
            } else {
                await createCoupon(data);
                setToast(true, "Coupon created successfully")
            }
            onClose(false);
            setRefresh((prev) => !prev)
        } catch (error) {

            setToast(false, error.message)
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" onClick={() => onClose(false)}>
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full h-[90vh] overflow-y-scroll" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">{couponData !== true ? 'Edit Coupon' : 'Create Coupon'}</h2>
                    <button onClick={() => onClose(false)} className="text-gray-500 hover:text-gray-700">&times;</button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Coupon Code */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Coupon Code</label>
                        <input
                            type="text"
                            {...register('code', { required: 'Coupon code is required' })}
                            className={`mt-1 block w-full p-2 border ${errors.code ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                            placeholder="Enter coupon code"
                        />
                        {errors.code && <span className="text-red-500 text-xs">{errors.code.message}</span>}
                    </div>

                    {/* Discount Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Discount Type</label>
                        <select
                            {...register('discountType', { required: 'Discount type is required' })}
                            className={`mt-1 block w-full p-2 border ${errors.discountType ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                        >
                            <option value="">Select discount type</option>
                            <option value="percentage">Percentage</option>
                            <option value="fixed">Fixed</option>
                        </select>
                        {errors.discountType && <span className="text-red-500 text-xs">{errors.discountType.message}</span>}
                    </div>

                    {/* Discount Value */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Discount Value</label>
                        <input
                            type="number"
                            {...register('discountValue', { required: 'Discount value is required', min: 1 })}
                            className={`mt-1 block w-full p-2 border ${errors.discountValue ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                            placeholder="Enter discount value"
                        />
                        {errors.discountValue && <span className="text-red-500 text-xs">{errors.discountValue.message}</span>}
                    </div>

                    {/* Minimum Purchase Amount */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Minimum Purchase Amount</label>
                        <input
                            type="number"
                            {...register('minPurchaseAmount', { required: 'Minimum Purchase Amount is required', min: 1 })}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Enter minimum purchase amount"
                        />
                        {errors.minPurchaseAmount && <span className="text-red-500 text-xs">{errors.minPurchaseAmount.message}</span>}
                    </div>

                    {/* Maximum Discount Amount */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Maximum Discount Amount</label>
                        <input
                            type="number"
                            {...register('maxDiscountAmount', { required: 'Max Discount Amount is required', min: 1 })}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Enter maximum discount amount"
                        />
                        {errors.maxDiscountAmount && <span className="text-red-500 text-xs">{errors.maxDiscountAmount.message}</span>}
                    </div>

                    {/* Expiry Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                        <input
                            type="date"
                            min={new Date().toISOString().split('T')[0]}
                            {...register('expiryDate', { required: 'Expiry date is required' })}
                            className={`mt-1 block w-full p-2 border ${errors.expiryDate ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                        />
                        {errors.expiryDate && <span className="text-red-500 text-xs">{errors.expiryDate.message}</span>}
                    </div>

                    {/* Usage Limit */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Usage Limit</label>
                        <input
                            type="number"
                            min={new Date()}
                            {...register('usageLimit', { required: 'Usage Limit is required', min: 1 })}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Enter usage limit"
                        />
                        {errors.usageLimit && <span className="text-red-500 text-xs">{errors.usageLimit.message}</span>}
                    </div>

                    {/* User Limit */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">User Limit</label>
                        <input
                            type="number"
                            {...register('userLimit', { required: 'User limit is required', min: 1 })}
                            className={`mt-1 block w-full p-2 border ${errors.userLimit ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                            placeholder="Enter user limit"
                        />
                        {errors.userLimit && <span className="text-red-500 text-xs">{errors.userLimit.message}</span>}
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-300"
                        >
                            {couponData !== true ? 'Update' : 'Submit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCouponPage;
