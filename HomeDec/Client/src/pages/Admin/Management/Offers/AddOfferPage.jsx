import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ListAllProducts } from '../../../../api/administrator/productManagement';
import { listCategory } from '../../../../api/administrator/categoryManagement';
import { useSelector } from 'react-redux';
import { IoIosClose } from 'react-icons/io';
import { createOffer, updateOffer } from '../../../../api/administrator/offerManagement';

const AddOfferPage = ({ isOpen, onClose, offerData, setRefresh, setToast }) => {
    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const { role } = useSelector((state) => state.auth)

    const transformItems = (item) => {
        return Object.entries(item).map(([id, title]) => ({
            id,
            title,
        }));
    };

    useEffect(() => {
        const loadData = async () => {
            const fetchedProducts = await ListAllProducts();
            const fetchedCategories = await listCategory(role);

            setProducts(fetchedProducts);
            setCategories(fetchedCategories);
        };
        loadData();

        if (offerData !== true) {
            reset(offerData);
            setSelectedCategories(transformItems(offerData.categories))
            setSelectedProducts(transformItems(offerData.products))
        }
    }, [isOpen, offerData, reset]);

    const watchStartDate = watch('startDate');

    const onSubmit = async (data) => {

        try {
            if (offerData !== true) {
                await updateOffer({ data, selectedProducts, selectedCategories }, offerData._id);
                setToast(true, "Offer updated successfully")
            } else {
                await createOffer({ data, selectedProducts, selectedCategories });
                setToast(true, "Offer created successfully")
            }
            onClose(false);
            setRefresh((prev) => !prev)
        } catch (error) {
            console.error(error.message);
            setToast(false, error.message)
        }
    };

    const addProductToOffers = (product) => {
        if (!selectedProducts.some(p => p.id === product.id)) {
            setSelectedProducts([...selectedProducts, product]);
        }
    };

    const removeProductFromOffers = (productId) => {
        setSelectedProducts(selectedProducts.filter(product => product.id !== productId));
    };


    const addCategoryToOffers = (category) => {
        if (!selectedCategories.some(cat => cat.id === category.id)) {
            setSelectedCategories([...selectedCategories, category]);
        }
    };

    const removeCategoryFromOffers = (categoryId) => {
        setSelectedCategories(selectedCategories.filter(category => category.id !== categoryId));
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" onClick={() => onClose(false)}>
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full h-[90vh] overflow-y-scroll" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">{offerData !== true ? 'Edit Offer' : 'Create Offer'}</h2>
                    <button onClick={() => onClose(false)} className="text-gray-500 hover:text-gray-700">&times;</button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Offer Title</label>
                        <input
                            type="text"
                            {...register('title', { required: 'Offer title is required' })}
                            className={`mt-1 block w-full p-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                            placeholder="Enter offer title"
                        />
                        {errors.title && <span className="text-red-500 text-xs">{errors.title.message}</span>}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            {...register('description', { required: 'Description is required' })}
                            className={`mt-1 block w-full p-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                            placeholder="Enter offer description"
                        />
                        {errors.description && <span className="text-red-500 text-xs">{errors.description.message}</span>}
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

                    {/* Start Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Start Date</label>
                        <input
                            type="date"
                            {...register('startDate', { required: 'Start date is required' })}
                            className={`mt-1 block w-full p-2 border ${errors.startDate ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                        />
                        {errors.startDate && <span className="text-red-500 text-xs">{errors.startDate.message}</span>}
                    </div>

                    {/* Expiry Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                        <input
                            type="date"
                            min={watchStartDate} // Set min date to watchStartDate
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
                            {...register('usageLimit', { required: 'Usage Limit is required', min: 1 })}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Enter usage limit"
                        />
                        {errors.usageLimit && <span className="text-red-500 text-xs">{errors.usageLimit.message}</span>}
                    </div>

                    {/* Product Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Select Product</label>
                        <select
                            onChange={(e) => {
                                const selectedProduct = JSON.parse(e.target.value); // Parse the selected product
                                addProductToOffers(selectedProduct);
                            }}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        >
                            <option value="">Select a product</option>
                            {products?.map(product => (
                                <option key={product._id} value={JSON.stringify({ id: product._id, title: product.title })}>
                                    {product.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {selectedProducts.map(product => (
                            <p key={product.id} className={"hover:shadow-md hover:scale-125 duration-150 font-bold flex items-center justify-center gap-1.5 font-nunito px-2 py-1 text-center rounded-md text-xs bg-green_100 text-green_700"}>
                                {product.title}
                                <div className='flex items-center justify-center bg-white w-3 h-3 rounded-full hover:scale-150 duration-150' onClick={() => removeProductFromOffers(product.id)}>
                                    <IoIosClose />
                                </div>
                            </p>
                        ))}
                    </div>

                    {/* Category Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Select Category</label>
                        <select
                            onChange={(e) => {
                                const selectedCategory = JSON.parse(e.target.value); // Parse the selected category
                                addCategoryToOffers(selectedCategory);
                            }}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        >
                            <option value="">Select a category</option>
                            {categories?.map(category => (
                                category.subcategories.map(item => (
                                    <option key={item._id} value={JSON.stringify({ id: item._id, title: item.name })}>
                                        {item.name}
                                    </option>
                                ))
                            ))}
                        </select>
                    </div>


                    <div className="flex flex-wrap gap-2">
                        {selectedCategories.map(category => (
                            <p key={category.id} className={`hover:shadow-md hover:scale-125 duration-150 font-bold flex items-center justify-center gap-1.5 font-nunito px-2 py-1 text-center rounded-md text-xs ${true ? "bg-green_100 text-green_700" : "bg-orange-700 text-white"}`}>
                                {categories.find(cat => cat.subcategories.some(sub => sub._id === category.id))?.subcategories.find(sub => sub._id === category.id)?.name}
                                <div className='flex items-center justify-center bg-white w-3 h-3 rounded-full hover:scale-150 duration-150' onClick={() => removeCategoryFromOffers(category.id)}>
                                    <IoIosClose />
                                </div>
                            </p>
                        ))}
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-300"
                        >
                            {offerData !== true ? 'Update' : 'Submit'}
                        </button>
                    </div>
                </form>
            </div >
        </div >
    );
};

export default AddOfferPage;



