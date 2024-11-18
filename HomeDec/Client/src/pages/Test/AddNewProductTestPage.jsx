import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TestToast = () => {
    const handleSave = () => {
        // Simulate success or error
        const isSuccess = true; // Change this to test

        if (isSuccess) {
            toast.success("Details updated successfully");
        } else {
            toast.error("Failed to update details");
        }
    };

    return (
        <div>
            <h1>Your Application</h1>
            <button onClick={handleSave}>Save</button>
            <ToastContainer />
        </div>
    );
};

export default TestToast;



// import React, { useEffect, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import ImageCrop from '../../../Test/ImageCrop';
// import { useNavigate } from 'react-router-dom';
// import { GiCancel } from 'react-icons/gi';
// import { useSelector } from 'react-redux';
// import api from '../../../../api/apiConfigAdmin';
// import { listCategory } from '../../../../api/administrator/categoryManagement';
// import { MANAGEMENT_ROUTES } from '../../../../config/routerConstants';

// const AddNewProduct = () => {
//     const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
//     const [error, setError] = useState("")
//     const [categoryList, setCategoryList] = useState([])
//     const [variants, setVariants] = useState([{ color: '', colorHex: '#000000', stock: '', images: [] }]);
//     const navigate = useNavigate();
//     const { role } = useSelector(state => state.auth);
//     const [selectedCategory, setSelectedCategory] = useState('');
//     const [subCategories, setSubCategories] = useState([]);

//     useEffect(() => {
//         const fetchCategories = async () => {
//             try {
//                 const list = await listCategory(role)
//
//                 setCategoryList(list);

//             } catch (error) {
//                 console.error('Error fetching products:', error);
//             }
//         };

//         fetchCategories();
//     }, []);

//     const onSubmit = async (data) => {
//         if (variants.length === 0) {
//             setError("You must add at least one variant.");
//             return;
//         }

//         for (let i = 0; i < variants.length; i++) {
//             if (variants[i].images.length < 3) {
//                 setError(`Variant ${i + 1} must have at least 3 images.`);
//                 return;
//             }
//         }


//         try {
//             // Create FormData object
//             const formData = new FormData();

//             // Append non-array fields
//             formData.append('category', data.category);
//             formData.append('subCategory', data.subCategory);
//             formData.append('title', data.title);
//             formData.append('description', data.description);
//             formData.append('deliveryCondition', data.deliveryCondition);
//             formData.append('warranty', data.warranty);
//             formData.append('relatedKeywords', data.relatedKeywords);

//             // Append item properties
//             data.itemProperties.forEach((property, index) => {
//                 formData.append(`itemProperties[${index}][field]`, property.field);
//                 formData.append(`itemProperties[${index}][value]`, property.value);
//             });

//             // Append variants
//             variants.forEach((variant, index) => {
//                 formData.append(`variants[${index}][color]`, variant.color);
//                 formData.append(`variants[${index}][colorHex]`, variant.colorHex);
//                 formData.append(`variants[${index}][stock]`, variant.stock);
//                 formData.append(`variants[${index}][price]`, variant.price);

//                 // Append images
//                 variant.images.forEach((img, imgIndex) => {
//

//                     formData.append(`variants[${index}][images][${imgIndex}]`, img.blob);
//                 });
//             });

//             // Send request to the API
//             const response = await api.post('/seller/products/add', formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 },
//             });

//             // Handle success response
//
//             navigate(`/${MANAGEMENT_ROUTES.PRODUCTS}/${MANAGEMENT_ROUTES.PRODUCTS_LIST}`)
//         } catch (error) {
//             setError("Failed to add product.");
//             console.error('Error:', error);
//         }
//     };

//     const handleAddVariant = () => {
//         setVariants((prev) => [...prev, { color: '', colorHex: '#000000', stock: '', price: '', images: [] }]);
//     };

//     const handleRemoveVariant = (index) => {
//         const newVariants = variants.filter((_, i) => i !== index);
//         setVariants(newVariants);
//     };

//     const handleAddImageToVariant = (index, croppedImage) => {
//         const updatedVariants = [...variants];

//         // Convert base64 image string to a Blob
//         const blob = dataURLtoBlob(croppedImage);
//

//         updatedVariants[index].images.push({ imageUrl: croppedImage, blob });
//         setVariants(updatedVariants);
//     };

//     const dataURLtoBlob = (dataURL) => {
//         const arr = dataURL.split(',');
//         const mime = arr[0].match(/:(.*?);/)[1];
//         const bstr = atob(arr[1]);
//         let n = bstr.length;
//         const u8arr = new Uint8Array(n);
//         while (n--) {
//             u8arr[n] = bstr.charCodeAt(n);
//         }
//         return new Blob([u8arr], { type: mime });
//     };

//     const handleRemoveImageFromVariant = (variantIndex, imageIndex) => {
//         const updatedVariants = [...variants];
//         updatedVariants[variantIndex].images.splice(imageIndex, 1);
//         setVariants(updatedVariants);
//     };

//     const handleCategoryChange = (event) => {
//         const categoryId = event.target.value;
//         setSelectedCategory(categoryId);

//         // Find the selected category and update subcategories
//         const selectedCategoryData = categoryList.find(category => category._id === categoryId);
//

//         if (selectedCategoryData) {
//             setSubCategories(selectedCategoryData.subcategories);
//         } else {
//             setSubCategories([]); // Reset if no category is selected
//         }
//     };

//     return (
//         <div className='max-w-4xl'>
//             <h1 className="text-2xl font-semibold mb-2 mt-6 px-5 font-nunito">Add New Product</h1>
//             <hr className='mb-5 mx-4' />
//             <form onSubmit={handleSubmit(onSubmit)} className="w-auto bg-white m-3 p-16 rounded-lg shadow-lg font-nunito flex flex-col gap-5">

//                 {/* Product Details */}
//                 <h3 className="font-semibold text-green_600">Product Details</h3>
//                 <div className="grid grid-cols-3 gap-5">
//                     <div>
//                         <label className="block text-sm mb-1 text-form_label_grey">Category</label>
//                         <select {...register('category', { required: 'Category is required' })} className={`w-full px-3 py-2 border ${errors.category ? 'border-red-500' : 'border-form_inputFeild_stroke_grey'} rounded-md bg-form_inputFeild_background_grey`} onChange={handleCategoryChange}
//                         >
//                             <option value="">Select a category</option>
//                             {
//                                 categoryList.map((category) => (
//                                     <option key={category._id} value={category._id}>
//                                         {category.name}
//                                     </option>
//                                 ))
//                             }
//                         </select>
//                         {errors.category && <p className="text-errorRed text-xs mt-1">{errors.category.message}</p>}
//                     </div>

//                     <div>
//                         <label className="block text-sm mb-1 text-form_label_grey">Sub Category</label>
//                         <select {...register('subCategory', { required: 'Sub Category is required' })} className={`w-full px-3 py-2 border ${errors.subCategory ? 'border-red-500' : 'border-form_inputFeild_stroke_grey'} rounded-md bg-form_inputFeild_background_grey`}>
//                             <option value="">Select a subcategory</option>
//                             {
//                                 subCategories.map((subCategory) => (
//                                     <option key={subCategory._id} value={subCategory._id}>
//                                         {subCategory.name}
//                                     </option>
//                                 ))
//                             }
//                         </select>
//                         {errors.subCategory && <p className="text-errorRed text-xs mt-1">{errors.subCategory.message}</p>}
//                     </div>

//                     <div className='col-span-2'>
//                         <label className="block text-sm mb-1 text-form_label_grey">Title</label>
//                         <input {...register('title', { required: 'Title is required' })} type="text" className={`w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-form_inputFeild_stroke_grey'} rounded-md bg-form_inputFeild_background_grey`} />
//                         {errors.title && <p className="text-errorRed text-xs mt-1">{errors.title.message}</p>}
//                     </div>
//                 </div>

//                 <div>
//                     <label className="block text-sm mb-1 text-form_label_grey">Description</label>
//                     <textarea {...register('description', { required: 'Description is required' })} className={`w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-form_inputFeild_stroke_grey'} rounded-md bg-form_inputFeild_background_grey`} rows="4"></textarea>
//                     {errors.description && <p className="text-errorRed text-xs mt-1">{errors.description.message}</p>}
//                 </div>

//                 {/* Variants Section */}
//                 <div>
//                     <h3 className="font-semibold mt-4 text-green_600 mb-3">Product Variants</h3>
//                     {variants.map((variant, index) => (
//                         <div key={index} className="border-2 p-4 rounded-md mt-1">
//                             <div className='flex mb-2'>
//                                 {/* Color Hex Input */}
//                                 <input
//                                     type="color"
//                                     value={variant.colorHex}
//                                     onChange={(e) => {
//                                         const newVariants = [...variants];
//                                         newVariants[index].colorHex = e.target.value;
//                                         setVariants(newVariants);
//                                     }}
//                                     className="w-full h-5 mr-3"
//                                 />
//                                 <button type="button" onClick={() => handleRemoveVariant(index)} className=" text-errorRed text-xs "><GiCancel size={20} /></button>
//                             </div>

//                             <div className="flex justify-between mb-2">
//                                 {/* Color Input */}
//                                 <div className=" flex items-center gap-3 mt-1">
//                                     <input
//                                         {...register(`variants.${index}.color`, { required: 'Color is required' })}
//                                         placeholder="Color"
//                                         value={variant.color}
//                                         onChange={(e) => {
//                                             const newVariants = [...variants];
//                                             newVariants[index].color = e.target.value;
//                                             setVariants(newVariants);
//                                         }}
//                                         className={`px-3 py-2 border ${errors.variants?.[index]?.color ? 'border-red-500' : 'border-form_inputFeild_stroke_grey'} rounded-md`}
//                                     />
//                                     {/* Display error message for Color */}
//                                     {errors.variants?.[index]?.color && (
//                                         <p className="text-errorRed text-xs mt-1">
//                                             {errors.variants[index].color.message}
//                                         </p>
//                                     )}
//                                 </div>


//                                 {/* Stock Input */}
//                                 <div className=" mt-1">
//                                     <input
//                                         {...register(`variants.${index}.stock`, {
//                                             required: 'Stock is required',
//                                             valueAsNumber: true,
//                                             min: { value: 0, message: 'Stock must be a positive number' },
//                                         })}
//                                         placeholder="Stock"
//                                         type="number"
//                                         value={variant.stock}
//                                         onChange={(e) => {
//                                             const newVariants = [...variants];
//                                             newVariants[index].stock = e.target.value;
//                                             setVariants(newVariants);
//                                         }}
//                                         className={`px-3 py-2 border ${errors.variants?.[index]?.stock ? 'border-red-500' : 'border-form_inputFeild_stroke_grey'} rounded-md`}
//                                     />
//                                     {/* Display error message for Stock */}
//                                     {errors.variants?.[index]?.stock && (
//                                         <p className="text-errorRed text-xs mt-1">
//                                             {errors.variants[index].stock.message}
//                                         </p>
//                                     )}
//                                 </div>

//                                 {/* Price */}
//                                 <div className=" mt-1">
//                                     <input
//                                         {...register(`variants.${index}.price`, {
//                                             required: 'Price is required',
//                                             valueAsNumber: true,
//                                             min: { value: 0, message: 'Price must be a positive number' },
//                                         })}
//                                         placeholder="Price"
//                                         type="number"
//                                         value={variant.price}
//                                         onChange={(e) => {
//                                             const newVariants = [...variants];
//                                             newVariants[index].price = e.target.value;
//                                             setVariants(newVariants);
//                                         }}
//                                         className={`px-3 py-2 border ${errors.variants?.[index]?.price ? 'border-red-500' : 'border-form_inputFeild_stroke_grey'} rounded-md`}
//                                     />
//                                     {/* Display error message for Stock */}
//                                     {errors.variants?.[index]?.price && (
//                                         <p className="text-errorRed text-xs mt-1">
//                                             {errors.variants[index].price.message}
//                                         </p>
//                                     )}
//                                 </div>
//                             </div>


//                             <div className="flex flex-wrap space-x-4">
//                                 {variant.images.map((img, imgIndex) => (
//                                     <div key={imgIndex} className="flex flex-col items-center">
//                                         <img src={img.imageUrl} alt="product" className="w-28 h-28 object-cover rounded-lg mt-2" />
//                                         <button type="button" onClick={() => handleRemoveImageFromVariant(index, imgIndex)} className="text-errorRed text-xs mt-1">Remove</button>
//                                     </div>
//                                 ))}
//                                 <label className="w-28 h-28 flex items-center justify-center bg-green_100 mt-2 rounded-lg cursor-pointer">
//                                     <ImageCrop index={index} handleAddImageToVariant={handleAddImageToVariant} />
//                                     +
//                                 </label>

//                             </div>

//                         </div>
//                     ))}
//                     <button type="button" onClick={handleAddVariant} className="w-44 mt-3 bg-green_500 hover:bg-green_600 text-white px-6 py-3 rounded-3xl text-sm font-medium">Add Variants</button>
//                 </div>

//                 {/*Product Properties*/}
//                 <div>
//                     <label className="block text-sm mb-1 text-form_label_grey">Add Item Property</label>
//                     {watch('itemProperties', [0]).map((property, index) => (
//                         <div key={index} className="flex gap-6 mt-1">
//                             <input
//                                 {...register(`itemProperties.${index}.field`, { required: 'Field is required' })}
//                                 placeholder="Field (e.g., Height)"
//                                 className={`w-64 px-3 py-2 border ${errors.itemProperties?.[index]?.field ? 'border-red-500' : 'border-form_inputFeild_stroke_grey'} rounded-md bg-form_inputFeild_background_grey focus:border-2 focus:border-green_500 focus:outline-none`}
//                             />
//                             <input
//                                 {...register(`itemProperties.${index}.value`, { required: 'Value is required' })}
//                                 placeholder="Value (e.g., 100 CM)"
//                                 className={`w-64 px-3 py-2 border ${errors.itemProperties?.[index]?.value ? 'border-red-500' : 'border-form_inputFeild_stroke_grey'} rounded-md bg-form_inputFeild_background_grey focus:border-2 focus:border-green_500 focus:outline-none`}
//                             />
//                             {errors.itemProperties?.[index]?.field && (
//                                 <p className="text-errorRed text-xs mt-1">{errors.itemProperties[index].field.message}</p>
//                             )}

//                         </div>
//                     ))}
//                     <button type="button" onClick={() => {
//                         const currentProperties = watch('itemProperties') || [];
//                         setValue('itemProperties', [...currentProperties, { field: '', value: '' }]);
//                     }} className="w-44 bg-green_500 hover:bg-green_600 text-white px-6 py-3 rounded-3xl text-sm font-medium mt-3">
//                         Add Properties
//                     </button>
//                 </div>

//                 {/*Delivery Condition*/}
//                 <div>
//                     <label className="block text-sm mb-1 text-form_label_grey">Delivery Condition</label>
//                     <select {...register('deliveryCondition', { required: 'Delivery condition is required' })} className={`w-1/2 px-3 py-2 border ${errors.deliveryCondition ? 'border-red-500' : 'border-form_inputFeild_stroke_grey'} rounded-md bg-form_inputFeild_background_grey focus:border-2 focus:border-green_500 focus:outline-none`}>
//                         <option value="">Select a delivery condition</option>
//                         <option value="Assembled">Assembled</option>
//                         <option value="Non-Assembled">Non-Assembled</option>
//                         <option value="Installation by Service Partner">Installation by Service Partner</option>
//                     </select>
//                     {errors.deliveryCondition && <p className="text-errorRed text-xs mt-1">{errors.deliveryCondition.message}</p>}
//                 </div>

//                 {/*Warranty Information*/}
//                 <div>
//                     <label className="block text-sm mb-1 text-form_label_grey">Warranty Information</label>
//                     <textarea {...register('warranty', { required: 'Warranty information is required' })} className={`w-full px-3 py-2 border ${errors.warranty ? 'border-red-500' : 'border-form_inputFeild_stroke_grey'} rounded-md bg-form_inputFeild_background_grey focus:border-2 focus:border-green_500 focus:outline-none`} rows="2"></textarea>
//                     {errors.warranty && <p className="text-errorRed text-xs mt-1">{errors.warranty.message}</p>}
//                 </div>

//                 {/*Related Keywords*/}
//                 <div>
//                     <label className="block text-sm mb-1 text-form_label_grey">Related Keywords</label>
//                     <textarea {...register('relatedKeywords', { required: 'Keywords are required' })} className={`w-full px-3 py-2 border ${errors.relatedKeywords ? 'border-red-500' : 'border-form_inputFeild_stroke_grey'} rounded-md bg-form_inputFeild_background_grey focus:border-2 focus:border-green_500 focus:outline-none`} rows="1"></textarea>
//                     {errors.relatedKeywords && <p className="text-errorRed text-xs mt-1">{errors.relatedKeywords.message}</p>}
//                 </div>

//                 {/* Show Error */}
//                 {error && <p className="text-errorRed text-xs">{error}</p>}

//                 {/* Submit Button */}
//                 <button type="submit" className="w-full bg-green_500 hover:bg-green_600 text-white px-6 py-3 rounded-md text-sm font-medium mt-5">
//                     Add Now
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default AddNewProduct;

