import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import ImageCrop from '../../Test/ImageCrop';
import { addProduct } from '../../../api/productManagement';
import api from '../../../api/apiConfig';

const AddNewProduct = () => {
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
    const [error, setError] = useState("")
    const [variants, setVariants] = useState([{ color: '', colorHex: '#000000', stock: '', images: [] }]);


    const onSubmit = async (data) => {
        if (variants.length === 0) {
            setError("You must add at least one variant.");
            return;
        }

        for (let i = 0; i < variants.length; i++) {
            if (variants[i].images.length < 3) {
                setError(`Variant ${i + 1} must have at least 3 images.`);
                return;
            }
        }


        try {
            console.log({ data, variants });

            await addProduct({ data, variants })
        } catch (error) {

        }
    };

    const handleAddVariant = () => {
        setVariants((prev) => [...prev, { color: '', colorHex: '#000000', stock: '', images: [] }]);
    };

    const handleRemoveVariant = (index) => {
        const newVariants = variants.filter((_, i) => i !== index);
        setVariants(newVariants);
    };

    const handleAddImageToVariant = async (index, croppedImage) => {
        const updatedVariants = [...variants];

        // If croppedImage is a base64 string, convert it to a Blob
        const blob = await fetch(croppedImage).then(r => r.blob());

        const formData = new FormData();
        formData.append("image", blob); // Make sure to use the right field name expected by the server

        try {
            const response = await api.post('/seller/products/add-product-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // This is necessary for file uploads
                }
            });
            console.log(response.data);

            console.log(updatedVariants);
            updatedVariants[index].images.push(response.data);
            setVariants(updatedVariants);

        } catch (err) {
            console.log(error);

        }
    };

    const handleRemoveImageFromVariant = async (variantIndex, imageIndex) => {

        const updatedVariants = [...variants];
        const imageToDelete = updatedVariants[variantIndex].images.splice(imageIndex, 1);

        try {
            const response = await api.delete('seller/products/delete-product-image', {
                data: { publicId: imageToDelete[imageIndex].publicId },
            });

            if (response.status === 200) {
                setVariants(updatedVariants);
                console.log(response.data.message); // Handle success
            }
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };

    return (
        <>
            <h1 className="text-2xl font-semibold mb-2 mt-6 px-5 font-nunito">Add New Product</h1>
            <hr className='mb-5 mx-4' />
            <form onSubmit={handleSubmit(onSubmit)} className="w-auto bg-white m-3 p-16 rounded-lg shadow-lg font-nunito flex flex-col gap-5 mr-36">

                {/* Product Details */}
                <h3 className="font-semibold text-green_600">Product Details</h3>
                <div className="grid grid-cols-3 gap-5">
                    <div>
                        <label className="block text-sm mb-1 text-form_label_grey">Category</label>
                        <select {...register('category', { required: 'Category is required' })} className={`w-full px-3 py-2 border ${errors.category ? 'border-red-500' : 'border-form_inputFeild_stroke_grey'} rounded-md bg-form_inputFeild_background_grey`}>
                            <option value="">Select a category</option>
                            <option value="Chair">Chair</option>
                            <option value="Table">Table</option>
                        </select>
                        {errors.category && <p className="text-errorRed text-xs mt-1">{errors.category.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm mb-1 text-form_label_grey">Sub Category</label>
                        <select {...register('subCategory', { required: 'Sub Category is required' })} className={`w-full px-3 py-2 border ${errors.subCategory ? 'border-red-500' : 'border-form_inputFeild_stroke_grey'} rounded-md bg-form_inputFeild_background_grey`}>
                            <option value="">Select a subcategory</option>
                            <option value="Wooden Chair">Wooden Chair</option>
                            <option value="Plastic Chair">Plastic Chair</option>
                        </select>
                        {errors.subCategory && <p className="text-errorRed text-xs mt-1">{errors.subCategory.message}</p>}
                    </div>

                    <div className='col-span-2'>
                        <label className="block text-sm mb-1 text-form_label_grey">Title</label>
                        <input {...register('title', { required: 'Title is required' })} type="text" className={`w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-form_inputFeild_stroke_grey'} rounded-md bg-form_inputFeild_background_grey`} />
                        {errors.title && <p className="text-errorRed text-xs mt-1">{errors.title.message}</p>}
                    </div>
                </div>

                <div>
                    <label className="block text-sm mb-1 text-form_label_grey">Description</label>
                    <textarea {...register('description', { required: 'Description is required' })} className={`w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-form_inputFeild_stroke_grey'} rounded-md bg-form_inputFeild_background_grey`} rows="4"></textarea>
                    {errors.description && <p className="text-errorRed text-xs mt-1">{errors.description.message}</p>}
                </div>

                {/* Variants Section */}
                <div>
                    <h3 className="font-semibold mt-4 text-green_600 mb-3">Product Variants</h3>
                    {variants.map((variant, index) => (
                        <div key={index} className="border p-4 rounded-md mt-1">
                            <div className="flex gap-4 mb-2">
                                {/* Color Input */}
                                <div className="w-1/2">
                                    <input
                                        {...register(`variants.${index}.color`, { required: 'Color is required' })}
                                        placeholder="Color"
                                        value={variant.color}
                                        onChange={(e) => {
                                            const newVariants = [...variants];
                                            newVariants[index].color = e.target.value;
                                            setVariants(newVariants);
                                        }}
                                        className={`px-3 py-2 border ${errors.variants?.[index]?.color ? 'border-red-500' : 'border-form_inputFeild_stroke_grey'} rounded-md`}
                                    />
                                    {/* Display error message for Color */}
                                    {errors.variants?.[index]?.color && (
                                        <p className="text-errorRed text-xs mt-1">
                                            {errors.variants[index].color.message}
                                        </p>
                                    )}
                                </div>

                                {/* Color Hex Input */}
                                <input
                                    type="color"
                                    value={variant.colorHex}
                                    onChange={(e) => {
                                        const newVariants = [...variants];
                                        newVariants[index].colorHex = e.target.value;
                                        setVariants(newVariants);
                                    }}
                                    className="w-10 h-10 mt-1"
                                />

                                {/* Stock Input */}
                                <div className="w-1/4">
                                    <input
                                        {...register(`variants.${index}.stock`, {
                                            required: 'Stock is required',
                                            valueAsNumber: true,
                                            min: { value: 0, message: 'Stock must be a positive number' },
                                        })}
                                        placeholder="Stock"
                                        type="number"
                                        value={variant.stock}
                                        onChange={(e) => {
                                            const newVariants = [...variants];
                                            newVariants[index].stock = e.target.value;
                                            setVariants(newVariants);
                                        }}
                                        className={`px-3 py-2 border ${errors.variants?.[index]?.stock ? 'border-red-500' : 'border-form_inputFeild_stroke_grey'} rounded-md`}
                                    />
                                    {/* Display error message for Stock */}
                                    {errors.variants?.[index]?.stock && (
                                        <p className="text-errorRed text-xs mt-1">
                                            {errors.variants[index].stock.message}
                                        </p>
                                    )}
                                </div>

                                {/* Price */}
                                <div className="w-1/4">
                                    <input
                                        {...register(`variants.${index}.price`, {
                                            required: 'Price is required',
                                            valueAsNumber: true,
                                            min: { value: 0, message: 'Price must be a positive number' },
                                        })}
                                        placeholder="Price"
                                        type="number"
                                        value={variant.price}
                                        onChange={(e) => {
                                            const newVariants = [...variants];
                                            newVariants[index].price = e.target.value;
                                            setVariants(newVariants);
                                        }}
                                        className={`px-3 py-2 border ${errors.variants?.[index]?.price ? 'border-red-500' : 'border-form_inputFeild_stroke_grey'} rounded-md`}
                                    />
                                    {/* Display error message for Stock */}
                                    {errors.variants?.[index]?.price && (
                                        <p className="text-errorRed text-xs mt-1">
                                            {errors.variants[index].price.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-wrap space-x-4">
                                {variant.images.map((img, imgIndex) => (
                                    <div key={imgIndex} className="flex flex-col items-center">
                                        <img src={img.imageUrl} alt="product" className="w-28 h-28 object-cover rounded-lg mt-2" />
                                        <button type="button" onClick={() => handleRemoveImageFromVariant(index, imgIndex)} className="text-errorRed text-xs mt-1">Remove</button>
                                    </div>
                                ))}
                                <label className="w-28 h-28 flex items-center justify-center bg-green_100 mt-2 rounded-lg cursor-pointer">
                                    <ImageCrop index={index} handleAddImageToVariant={handleAddImageToVariant} />
                                    +
                                </label>

                            </div>

                            <button type="button" onClick={() => handleRemoveVariant(index)} className="text-errorRed text-xs mt-1">Remove Variant</button>
                        </div>
                    ))}
                    <button type="button" onClick={handleAddVariant} className="w-44 mt-3 bg-green_500 hover:bg-green_600 text-white px-6 py-3 rounded-3xl text-sm font-medium">Add Variants</button>
                </div>

                {/*Product Properties*/}
                <div>
                    <label className="block text-sm mb-1 text-form_label_grey">Add Item Property</label>
                    {watch('itemProperties', [0]).map((property, index) => (
                        <div key={index} className="flex gap-6 mt-1">
                            <input
                                {...register(`itemProperties.${index}.field`, { required: 'Field is required' })}
                                placeholder="Field (e.g., Height)"
                                className={`w-64 px-3 py-2 border ${errors.itemProperties?.[index]?.field ? 'border-red-500' : 'border-form_inputFeild_stroke_grey'} rounded-md bg-form_inputFeild_background_grey focus:border-2 focus:border-green_500 focus:outline-none`}
                            />
                            <input
                                {...register(`itemProperties.${index}.value`, { required: 'Value is required' })}
                                placeholder="Value (e.g., 100 CM)"
                                className={`w-64 px-3 py-2 border ${errors.itemProperties?.[index]?.value ? 'border-red-500' : 'border-form_inputFeild_stroke_grey'} rounded-md bg-form_inputFeild_background_grey focus:border-2 focus:border-green_500 focus:outline-none`}
                            />
                            {errors.itemProperties?.[index]?.field && (
                                <p className="text-errorRed text-xs mt-1">{errors.itemProperties[index].field.message}</p>
                            )}

                        </div>
                    ))}
                    <button type="button" onClick={() => {
                        const currentProperties = watch('itemProperties') || [];
                        setValue('itemProperties', [...currentProperties, { field: '', value: '' }]);
                    }} className="w-44 bg-green_500 hover:bg-green_600 text-white px-6 py-3 rounded-3xl text-sm font-medium mt-3">
                        Add Properties
                    </button>
                </div>

                {/*Delivery Condition*/}
                <div>
                    <label className="block text-sm mb-1 text-form_label_grey">Delivery Condition</label>
                    <select {...register('deliveryCondition', { required: 'Delivery condition is required' })} className={`w-1/2 px-3 py-2 border ${errors.deliveryCondition ? 'border-red-500' : 'border-form_inputFeild_stroke_grey'} rounded-md bg-form_inputFeild_background_grey focus:border-2 focus:border-green_500 focus:outline-none`}>
                        <option value="">Select a delivery condition</option>
                        <option value="Assembled">Assembled</option>
                        <option value="Non-Assembled">Non-Assembled</option>
                        <option value="Installation by Service Partner">Installation by Service Partner</option>
                    </select>
                    {errors.deliveryCondition && <p className="text-errorRed text-xs mt-1">{errors.deliveryCondition.message}</p>}
                </div>

                {/*Warranty Information*/}
                <div>
                    <label className="block text-sm mb-1 text-form_label_grey">Warranty Information</label>
                    <textarea {...register('warranty', { required: 'Warranty information is required' })} className={`w-full px-3 py-2 border ${errors.warranty ? 'border-red-500' : 'border-form_inputFeild_stroke_grey'} rounded-md bg-form_inputFeild_background_grey focus:border-2 focus:border-green_500 focus:outline-none`} rows="2"></textarea>
                    {errors.warranty && <p className="text-errorRed text-xs mt-1">{errors.warranty.message}</p>}
                </div>

                {/*Related Keywords*/}
                <div>
                    <label className="block text-sm mb-1 text-form_label_grey">Related Keywords</label>
                    <textarea {...register('relatedKeywords', { required: 'Keywords are required' })} className={`w-full px-3 py-2 border ${errors.relatedKeywords ? 'border-red-500' : 'border-form_inputFeild_stroke_grey'} rounded-md bg-form_inputFeild_background_grey focus:border-2 focus:border-green_500 focus:outline-none`} rows="1"></textarea>
                    {errors.relatedKeywords && <p className="text-errorRed text-xs mt-1">{errors.relatedKeywords.message}</p>}
                </div>

                {/* Show Error */}
                {error && <p className="text-errorRed text-xs">{error}</p>}

                {/* Submit Button */}
                <button type="submit" className="w-full bg-green_500 hover:bg-green_600 text-white px-6 py-3 rounded-md text-sm font-medium mt-5">
                    Add Now
                </button>
            </form>
        </>
    );
};

export default AddNewProduct;
