import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { createSeller } from '../../../../api/auth';
import { useNavigate } from 'react-router-dom';

const AddSellerForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm();
    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate()


    const fileInputRef = useRef(null);

    const handleDivClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setImagePreview(objectUrl);
        }
        console.log(file);
    };

    const onSubmit = async (data) => {
        try {
            console.log('Form Data: ', data);
            const response = await createSeller(data)
            console.log(response);
            navigate("/admin/sellers/list")

        } catch (err) {
            console.log(err.error);
            setError(err.message);
        }
    };

    return (
        <>
            <h1 className="text-2xl font-semibold mb-2 mt-6 px-5 font-nunito">Add New Seller</h1>
            <hr className='mb-5 mx-4' />
            <div className="w-auto bg-white m-3 p-16 rounded-lg shadow-lg font-nunito">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-5 gap-6">
                        {/* Basic Details */}
                        <div className="col-span-4 mr-16">
                            <h3 className="font-semibold mb-4 text-green_600">Basic Details</h3>
                            <div className="flex justify-between gap-6">
                                <div className="mb-4 w-full">
                                    <label className="block text-sm mb-1 text-form_label_grey">Seller Name / Business Name</label>
                                    <input
                                        type="text"
                                        {...register("sellerName", { required: "Seller name is required" })}
                                        className="w-full px-3 py-2 border border-form_inputFeild_stroke_grey rounded-md bg-form_inputFeild_background_grey focus:border-2 focus:border-green_500 focus:outline-none"
                                    />
                                    {errors.sellerName && <p className="text-red-500 text-xs mt-1">{errors.sellerName.message}</p>}
                                </div>
                                <div className="mb-4 w-full">
                                    <label className="block text-sm mb-1 text-form_label_grey">Email</label>
                                    <input
                                        type="email"
                                        {...register("email", {
                                            required: "Email is required",
                                            pattern: {
                                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                                message: "Enter a valid email address",
                                            },
                                        })}
                                        className="w-full px-3 py-2 border border-form_inputFeild_stroke_grey rounded-md bg-form_inputFeild_background_grey focus:border-2 focus:border-green_500 focus:outline-none"
                                    />
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                                </div>
                            </div>
                            <div className="flex justify-between gap-6">
                                <div className="mb-4 w-full">
                                    <label className="block text-sm mb-1 text-form_label_grey">Password</label>
                                    <input
                                        type="password"
                                        {...register("password", { required: "Password is required", minLength: { value: 6, message: "Minimum length is 6" } })}
                                        className="w-full px-3 py-2 border border-form_inputFeild_stroke_grey rounded-md bg-form_inputFeild_background_grey focus:border-2 focus:border-green_500 focus:outline-none"
                                    />
                                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                                </div>
                                <div className="mb-4 w-full">
                                    <label className="block text-sm mb-1 text-form_label_grey">Confirm Password</label>
                                    <input
                                        type="password"
                                        {...register("confirmPassword", {
                                            required: "Confirm password is required",
                                            validate: (value) => value === watch('password') || "Passwords do not match"
                                        })}
                                        className="w-full px-3 py-2 border border-form_inputFeild_stroke_grey rounded-md bg-form_inputFeild_background_grey focus:border-2 focus:border-green_500 focus:outline-none"
                                    />
                                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
                                </div>
                            </div>
                            {/* Business Details */}
                            <h3 className="font-semibold mt-7 mb-4 text-green_600">Business Details</h3>
                            <div className="flex justify-between gap-6">
                                <div className="mb-4 w-full">
                                    <label className="block text-sm mb-1 text-form_label_grey">Business Name</label>
                                    <input
                                        type="text"
                                        {...register("businessName", { required: "Business name is required" })}
                                        className="w-full px-3 py-2 border border-form_inputFeild_stroke_grey rounded-md bg-form_inputFeild_background_grey focus:border-2 focus:border-green_500 focus:outline-none"
                                    />
                                    {errors.businessName && <p className="text-red-500 text-xs mt-1">{errors.businessName.message}</p>}
                                </div>
                                <div className="mb-4 w-full">
                                    <label className="block text-sm mb-1 text-form_label_grey">Tax Identification Number (TIN)</label>
                                    <input
                                        type="text"
                                        {...register("", { required: "Tax ID is required" })}
                                        {...register("taxId", {
                                            required: "TIN ID is required",
                                            pattern: {
                                                value: /^[0-9]*$/,
                                                message: "TIN ID must be numeric"
                                            }
                                        })}
                                        className="w-full px-3 py-2 border border-form_inputFeild_stroke_grey rounded-md bg-form_inputFeild_background_grey focus:border-2 focus:border-green_500 focus:outline-none"
                                    />
                                    {errors.taxId && <p className="text-red-500 text-xs mt-1">{errors.taxId.message}</p>}
                                </div>
                            </div>
                            <div className="flex justify-between gap-6">
                                <div className="mb-4 w-full">
                                    <label className="block text-sm mb-1 text-form_label_grey">Contact Number</label>
                                    <input
                                        type="text"
                                        {...register("contactNumber", {
                                            required: "Contact number is required",
                                            pattern: {
                                                value: /^[0-9]*$/,
                                                message: "Contact number must be numeric"
                                            }
                                        })}
                                        className="w-full px-3 py-2 border border-form_inputFeild_stroke_grey rounded-md bg-form_inputFeild_background_grey focus:border-2 focus:border-green_500 focus:outline-none"
                                    />
                                    {errors.contactNumber && <p className="text-red-500 text-xs mt-1">{errors.contactNumber.message}</p>}
                                </div>
                                <div className="mb-4 w-full">
                                    <label className="block text-sm mb-1 text-form_label_grey">Alternate Contact Number</label>
                                    <input
                                        type="text"
                                        {...register("altContactNumber", {
                                            pattern: {
                                                value: /^[0-9]*$/,
                                                message: "Alternate contact number must be numeric"
                                            }
                                        })}
                                        className="w-full px-3 py-2 border border-form_inputFeild_stroke_grey rounded-md bg-form_inputFeild_background_grey focus:border-2 focus:border-green_500 focus:outline-none"
                                    />
                                    {errors.altContactNumber && <p className="text-red-500 text-xs mt-1">{errors.altContactNumber.message}</p>}
                                </div>
                            </div>

                        </div>

                        {/* Profile Image */}
                        {/* <div className="col-span-1 flex justify-center items-center">
                            <div>
                                <div className="w-52 h-52 rounded-full flex justify-center items-center overflow-hidden mx-auto mt-14 border border-form_inputFeild_stroke_grey bg-form_inputFeild_background_grey hover:bg-green_50 cursor-pointer" onClick={handleDivClick}>
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Profile" className="object-cover w-full h-full rounded-full" />
                                    ) : (
                                        <h3 className="font-semibold text-green_600">Select Image</h3>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="hidden"
                                    accept="image/*"
                                />
                            </div>
                        </div> */}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm mb-1 text-form_label_grey">Address</label>
                        <textarea
                            {...register("address", { required: "Address is required" })}
                            className="w-full px-3 py-2 border border-form_inputFeild_stroke_grey rounded-md bg-form_inputFeild_background_grey focus:border-2 focus:border-green_500 focus:outline-none"
                            rows="3"
                        ></textarea>
                        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                    </div>

                    {/* Contract Details */}
                    <h3 className="font-semibold mb-4 mt-10 text-green_600">Contract Details</h3>
                    <div className="flex justify-between gap-6 mb-6">
                        <div className="mb-4 w-96">
                            <label className="block text-sm mb-1 text-form_label_grey">Commission Rate</label>
                            <div className="flex items-center">
                                <input
                                    type="number"
                                    {...register("commissionRate", { required: "Commission rate is required", min: { value: 0, message: "Must be at least 0" } })}
                                    className="w-full px-3 py-2 border border-form_inputFeild_stroke_grey rounded-md bg-form_inputFeild_background_grey focus:border-2 focus:border-green_500 focus:outline-none"
                                />
                                <span className="ml-2">%</span>
                            </div>
                            {errors.commissionRate && <p className="text-red-500 text-xs mt-1">{errors.commissionRate.message}</p>}
                        </div>
                    </div>

                    {/* Documents */}
                    <h3 className="font-semibold mt-10 mb-4 text-green_600">Documents / Verification</h3>
                    <div className="grid grid-cols-1">
                        <div className="w-32 h-32 mb-10 bg-gray-200 flex items-center justify-center rounded-lg">
                            <span className="text-xl text-gray-400">+</span>
                        </div>
                        {error && <p className="text-red-500 text-sm my-2">{error}</p>}
                        <button
                            type="submit"
                            className="bg-green_500 hover:bg-green_600 text-white px-6 py-3 rounded-md text-sm font-medium"
                        >
                            Add Seller
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AddSellerForm;
