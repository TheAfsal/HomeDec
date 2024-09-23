



























// import React, { useState } from 'react';
// import { useForm } from 'react-hook-form';

// const AddNewProduct = () => {
//     const { handleSubmit, register, setValue, watch, formState: { errors } } = useForm();
//     const [images, setImages] = useState([]);

//     const onSubmit = (data) => {
//         console.log(data);
//     };

//     const handleAddImage = (imageUrl) => {
//         const newImage = { url: imageUrl, colorHex: '#000000' };
//         setImages((prevImages) => [...prevImages, newImage]);
//         setValue('images', [...images, newImage]);
//     };

//     const handleRemoveImage = (index) => {
//         const newImages = images.filter((_, i) => i !== index);
//         setImages(newImages);
//         setValue('images', newImages);
//     };

//     return (
//         <>
//             <h1 className="text-2xl font-semibold mb-2 mt-6 px-5 font-nunito">Add New Product</h1>
//             <hr className='mb-5 mx-4' />
//             <form onSubmit={handleSubmit(onSubmit)} className="w-auto bg-white m-3 p-16 rounded-lg shadow-lg font-nunito flex flex-col gap-5">
//                 <h3 className="font-semibold text-green_600">Product Details</h3>

//                 <div className="grid grid-cols-3 gap-5">
//                     <div>
//                         <label className="block text-sm mb-1 text-form_label_grey">Category</label>
//                         <select {...register('category', { required: 'Category is required' })} className={`w-full px-3 py-2 border ${errors.category ? 'border-red-500' : 'border-form_inputFeild_stroke_grey'} rounded-md bg-form_inputFeild_background_grey focus:border-2 focus:border-green_500 focus:outline-none`}>
//                             <option value="">Select a category</option>
//                             <option value="Chair">Chair</option>
//                             <option value="Table">Table</option>
//                             {/* Add other categories */}
//                         </select>
//                         {errors.category && <p className="text-errorRed text-xs mt-1">{errors.category.message}</p>}
//                     </div>

//                     <div>
//                         <label className="block text-sm mb-1 text-form_label_grey">Sub Category</label>
//                         <select {...register('subCategory', { required: 'Sub Category is required' })} className={`w-full px-3 py-2 border ${errors.subCategory ? 'border-red-500' : 'border-form_inputFeild_stroke_grey'} rounded-md bg-form_inputFeild_background_grey focus:border-2 focus:border-green_500 focus:outline-none`}>
//                             <option value="">Select a subcategory</option>
//                             <option value="Wooden Chair">Wooden Chair</option>
//                             <option value="Plastic Chair">Plastic Chair</option>
//                             {/* Add other subcategories */}
//                         </select>
//                         {errors.subCategory && <p className="text-errorRed text-xs mt-1">{errors.subCategory.message}</p>}
//                     </div>

//                     <div className='col-span-2'>
//                         <label className="block text-sm mb-1 text-form_label_grey">Title</label>
//                         <input {...register('title', { required: 'Title is required' })} type="text" className={`w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-form_inputFeild_stroke_grey'} rounded-md bg-form_inputFeild_background_grey focus:border-2 focus:border-green_500 focus:outline-none`} />
//                         {errors.title && <p className="text-errorRed text-xs mt-1">{errors.title.message}</p>}
//                     </div>
//                 </div>

//                 <div>
//                     <label className="block text-sm mb-1 text-form_label_grey">Description</label>
//                     <textarea {...register('description', { required: 'Description is required' })} className={`w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-form_inputFeild_stroke_grey'} rounded-md bg-form_inputFeild_background_grey focus:border-2 focus:border-green_500 focus:outline-none`} rows="4"></textarea>
//                     {errors.description && <p className="text-errorRed text-xs mt-1">{errors.description.message}</p>}
//                 </div>

//                 <div>
//                     <h3 className="font-semibold mt-4 text-green_600">Product Images</h3>
//                     <hr className='mt-2 mb-4' />
//                     <div className="mt-2">
//                         <label className="block text-sm mb-1 text-form_label_grey">Enter Color Code in HEX</label>
//                         <input {...register('colorHex', { required: 'Color code is required' })} type="color" className={`w-10 h-10 p-1 rounded-md border ${errors.colorHex ? 'border-red-500' : 'border-form_inputFeild_stroke_grey'}`} />
//                         {errors.colorHex && <p className="text-errorRed text-xs mt-1">{errors.colorHex.message}</p>}
//                     </div>
//                 </div>

//                 <div>
//                     <div className='flex flex-col p-3 border border-form_inputFeild_stroke_grey rounded-md bg-form_inputFeild_background_grey'>
//                         <label className="font-semibold text-green_600">Add Product Images</label>
//                         <div className="flex flex-wrap space-x-4">
//                             {images.map((img, index) => (
//                                 <div key={index} className="flex flex-col items-center">
//                                     <img src={img.url} alt="product" className="w-28 h-28 object-cover rounded-lg mt-2" />
//                                     <input
//                                         type="color"
//                                         value={img.colorHex}
//                                         onChange={(e) => {
//                                             const newImages = [...images];
//                                             newImages[index].colorHex = e.target.value;
//                                             setImages(newImages);
//                                             setValue('images', newImages);
//                                         }}
//                                         className="w-10 h-10 mt-1"
//                                     />
//                                     <button type="button" onClick={() => handleRemoveImage(index)} className="text-errorRed text-xs mt-1">Remove</button>
//                                 </div>
//                             ))}
//                             <button type="button" onClick={() => handleAddImage('https://via.placeholder.com/150')} className="w-28 h-28 flex items-center justify-center bg-green_100 mt-2 rounded-lg">
//                                 +
//                             </button>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="flex gap-6 mt-4">
//                     <div>
//                         <label className="block text-sm mb-1 text-form_label_grey">Price</label>
//                         <input {...register('price', { required: 'Price is required', valueAsNumber: true })} type="number" className={`w-52 px-3 py-2 border ${errors.price ? 'border-red-500' : 'border-form_inputFeild_stroke_grey'} rounded-md bg-form_inputFeild_background_grey focus:border-2 focus:border-green_500 focus:outline-none`} />
//                         {errors.price && <p className="text-errorRed text-xs mt-1">{errors.price.message}</p>}
//                     </div>
//                     <div>
//                         <label className="block text-sm mb-1 text-form_label_grey">Number of Stocks</label>
//                         <input {...register('stock', { required: 'Stock number is required', valueAsNumber: true })} type="number" className={`w-52 px-3 py-2 border ${errors.stock ? 'border-red-500' : 'border-form_inputFeild_stroke_grey'} rounded-md bg-form_inputFeild_background_grey focus:border-2 focus:border-green_500 focus:outline-none`} />
//                         {errors.stock && <p className="text-errorRed text-xs mt-1">{errors.stock.message}</p>}
//                     </div>
//                 </div>

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

//                 <div>
//                     <label className="block text-sm mb-1 text-form_label_grey">Add Item Property</label>
//                     {watch('itemProperties', []).map((property, index) => (
//                         <div key={index} className="flex gap-6 mb-2">
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
//                         </div>
//                     ))}
//                     <button type="button" onClick={() => {
//                         const currentProperties = watch('itemProperties') || [];
//                         setValue('itemProperties', [...currentProperties, { field: '', value: '' }]);
//                     }} className="w-44 bg-green_500 hover:bg-green_600 text-white px-6 py-3 rounded-3xl text-sm font-medium mt-5">
//                         Add Properties
//                     </button>
//                 </div>

//                 <div>
//                     <label className="block text-sm mb-1 text-form_label_grey">Warranty Information</label>
//                     <textarea {...register('warranty', { required: 'Warranty information is required' })} className={`w-full px-3 py-2 border ${errors.warranty ? 'border-red-500' : 'border-form_inputFeild_stroke_grey'} rounded-md bg-form_inputFeild_background_grey focus:border-2 focus:border-green_500 focus:outline-none`} rows="2"></textarea>
//                     {errors.warranty && <p className="text-errorRed text-xs mt-1">{errors.warranty.message}</p>}
//                 </div>

//                 <button type="submit" className="w-full bg-green_500 hover:bg-green_600 text-white px-6 py-3 rounded-md text-sm font-medium mt-5">
//                     Add Now
//                 </button>
//             </form>
//         </>
//     );
// };

// export default AddNewProduct;
