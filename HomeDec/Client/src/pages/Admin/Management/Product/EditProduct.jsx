// import React, { useEffect, useState } from 'react';
// import ImageCrop from '../../../Test/ImageCrop';
// import { useNavigate, useParams } from 'react-router-dom';
// import { GiCancel } from 'react-icons/gi';
// import { useSelector } from 'react-redux';
// import { listCategory } from '../../../../api/administrator/categoryManagement';
// import { fetchDetails } from '../../../../api/administrator/productManagement';
// import { MANAGEMENT_ROUTES } from '../../../../config/routerConstants';

// const EditProduct = () => {
//     const [error, setError] = useState("");
//     const [validationErrors, setValidationErrors] = useState({});
//     const [categoryList, setCategoryList] = useState([]);
//     const navigate = useNavigate();
//     const { role } = useSelector(state => state.auth);
//     const { id } = useParams();

//     const [product, setProduct] = useState({});
//     const [variants, setVariants] = useState([{ color: '', colorHex: '#000000', stock: '', price: '', images: [] }]);
//     const [formData, setFormData] = useState({
//         category: '',
//         subCategory: '',
//         title: '',
//         description: '',
//         itemProperties: [],
//         deliveryCondition: '',
//         warranty: '',
//         relatedKeywords: '',
//         id
//     });
//     const [subCategories, setSubCategories] = useState([]);

//     useEffect(() => {
//         const fetchProductDetails = async () => {
//             try {
//                 const list = await fetchDetails(id);
//                 setProduct(list[0]);
//                 setVariants(list[0].variants);
//                 setFormData(prev => ({
//                     ...prev,
//                     itemProperties: list[0].itemProperties || [],
//                     category: list[0].category || '',
//                     title: list[0].title || '',
//                     description: list[0].description || '',
//                     deliveryCondition: list[0].deliveryCondition || '',
//                     warranty: list[0].warranty || '',
//                     relatedKeywords: list[0].relatedKeywords || ''
//                 }));
//             } catch (error) {
//                 console.error('Error fetching product details:', error);
//             }
//         };

//         fetchProductDetails();
//     }, [id]);

//     useEffect(() => {
//         const fetchCategories = async () => {
//             try {
//                 const list = await listCategory(role);
//                 setCategoryList(list);
//             } catch (error) {
//                 console.error('Error fetching categories:', error);
//             }
//         };

//         fetchCategories();
//     }, [role]);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: value
//         }));
//         setValidationErrors(prev => ({ ...prev, [name]: '' }));
//     };

//     const handleAddVariant = () => {
//         setVariants(prev => [...prev, { color: '', colorHex: '#000000', stock: '', price: '', images: [] }]);
//     };

//     const handleRemoveVariant = (index) => {
//         const newVariants = variants.filter((_, i) => i !== index);
//         setVariants(newVariants);
//     };

//     const handleCategoryChange = (event) => {
//         const categoryId = event.target.value;
//         setFormData(prev => ({ ...prev, category: categoryId }));

//         const selectedCategoryData = categoryList.find(category => category._id === categoryId);
//         if (selectedCategoryData) {
//             setSubCategories(selectedCategoryData.subcategories);
//         } else {
//             setSubCategories([]);
//         }
//     };

//     const validateFields = () => {
//         const errors = {};
//         if (!formData.category) errors.category = 'Category is required';
//         if (!formData.subCategory) errors.subCategory = 'Sub Category is required';
//         if (!formData.title) errors.title = 'Title is required';
//         if (!formData.description) errors.description = 'Description is required';
//         if (!formData.deliveryCondition) errors.deliveryCondition = 'Delivery condition is required';
//         if (!formData.warranty) errors.warranty = 'Warranty is required';
//         if (!formData.relatedKeywords) errors.relatedKeywords = 'Related keywords are required';

//         variants.forEach((variant, index) => {
//             if (!variant.color) errors[`variantColor${index}`] = 'Color is required';
//             if (variant.stock <= 0) errors[`variantStock${index}`] = 'Stock must be greater than 0';
//             if (variant.price <= 0) errors[`variantPrice${index}`] = 'Price must be greater than 0';
//         });

//         return errors;
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         const errors = validateFields();
//         if (Object.keys(errors).length > 0) {
//             setValidationErrors(errors);
//             return;
//         }

//         try {
//             const response = await api.post('/seller/products/edit', { ...formData, variants });
//             console.log('Product updated successfully:', response.data);
//             navigate(`/${MANAGEMENT_ROUTES.PRODUCTS}/${MANAGEMENT_ROUTES.PRODUCTS_LIST}`)
//         } catch (error) {
//             setError("Failed to update product.");
//             console.error('Error:', error);
//         }
//     };

//     const handleAddImageToVariant = (index, croppedImage) => {
//         const updatedVariants = [...variants];

//         // Convert base64 image string to a Blob
//         const blob = dataURLtoBlob(croppedImage);
//         console.log(blob);

//         updatedVariants[index].images.push({ imageUrl: croppedImage, blob });
//         setVariants(updatedVariants);
//     };

//     return (
//         <div className='max-w-4xl'>
//             <h1 className="text-2xl font-semibold mb-2 mt-6 px-5 font-nunito">Edit Product</h1>
//             <hr className='mb-5 mx-4' />
//             <form onSubmit={handleSubmit} className="w-auto bg-white m-3 p-16 rounded-lg shadow-lg font-nunito flex flex-col gap-5">
//                 {/* Product Details */}
//                 <h3 className="font-semibold text-green_600">Product Details</h3>
//                 <div className="grid grid-cols-3 gap-5">
//                     <div>
//                         <label className="block text-sm mb-1 text-form_label_grey">Category</label>
//                         <select name="category" value={formData.category} onChange={handleCategoryChange} className="w-full px-3 py-2 border rounded-md bg-form_inputFeild_background_grey">
//                             <option value="">Select a category</option>
//                             {categoryList.map(category => (
//                                 <option key={category._id} value={category._id}>{category.name}</option>
//                             ))}
//                         </select>
//                         {validationErrors.category && <p className="text-red-500 text-xs">{validationErrors.category}</p>}
//                     </div>

//                     <div>
//                         <label className="block text-sm mb-1 text-form_label_grey">Sub Category</label>
//                         <select name="subCategory" value={formData.subCategory} onChange={handleChange} className="w-full px-3 py-2 border rounded-md bg-form_inputFeild_background_grey">
//                             <option value="">Select a subcategory</option>
//                             {subCategories.map(subCategory => (
//                                 <option key={subCategory._id} value={subCategory.name}>{subCategory.name}</option>
//                             ))}
//                         </select>
//                         {validationErrors.subCategory && <p className="text-red-500 text-xs">{validationErrors.subCategory}</p>}
//                     </div>

//                     <div className='col-span-2'>
//                         <label className="block text-sm mb-1 text-form_label_grey">Title</label>
//                         <input name="title" value={formData.title} onChange={handleChange} type="text" className="w-full px-3 py-2 border rounded-md bg-form_inputFeild_background_grey" />
//                         {validationErrors.title && <p className="text-red-500 text-xs">{validationErrors.title}</p>}
//                     </div>
//                 </div>

//                 <div>
//                     <label className="block text-sm mb-1 text-form_label_grey">Description</label>
//                     <textarea name="description" value={formData.description} onChange={handleChange} className="w-full px-3 py-2 border rounded-md bg-form_inputFeild_background_grey" rows="4"></textarea>
//                     {validationErrors.description && <p className="text-red-500 text-xs">{validationErrors.description}</p>}
//                 </div>

//                 {/* Variants Section */}
//                 <div>
//                     <h3 className="font-semibold mt-4 text-green_600 mb-3">Product Variants</h3>
//                     {variants.map((variant, index) => (
//                         <div key={index} className="border-2 p-4 rounded-md mt-1">
//                             <div className='flex mb-2'>
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

//                             <div className="flex flex-col justify-between mb-2">
//                                 <input
//                                     name={`variants.${index}.color`}
//                                     placeholder="Color"
//                                     value={variant.color}
//                                     onChange={(e) => {
//                                         const newVariants = [...variants];
//                                         newVariants[index].color = e.target.value;
//                                         setVariants(newVariants);
//                                     }}
//                                     className="px-3 py-2 border rounded-md bg-form_inputFeild_background_grey flex-1 mr-2"
//                                 />
//                                 {validationErrors[`variantColor${index}`] && <p className="text-red-500 text-xs">{validationErrors[`variantColor${index}`]}</p>}

//                                 <input
//                                     name={`variants.${index}.stock`}
//                                     placeholder="Stock"
//                                     type="number"
//                                     value={variant.stock}
//                                     onChange={(e) => {
//                                         const newVariants = [...variants];
//                                         newVariants[index].stock = e.target.value;
//                                         setVariants(newVariants);
//                                     }}
//                                     className="px-3 py-2 border rounded-md bg-form_inputFeild_background_grey flex-1 mr-2"
//                                 />
//                                 {validationErrors[`variantStock${index}`] && <p className="text-red-500 text-xs">{validationErrors[`variantStock${index}`]}</p>}

//                                 <input
//                                     name={`variants.${index}.price`}
//                                     placeholder="Price"
//                                     type="number"
//                                     value={variant.price}
//                                     onChange={(e) => {
//                                         const newVariants = [...variants];
//                                         newVariants[index].price = e.target.value;
//                                         setVariants(newVariants);
//                                     }}
//                                     className="px-3 py-2 border rounded-md bg-form_inputFeild_background_grey flex-1"
//                                 />
//                                 <div className="flex flex-wrap space-x-4">
//                                     {variant.images.map((img, imgIndex) => (
//                                         <div key={imgIndex} className="flex flex-col items-center">
//                                             <img src={img.imageUrl || img.secure_url} alt="product" className="w-28 h-28 object-cover rounded-lg mt-2" />
//                                             <button type="button"
//                                                 // onClick={() => handleRemoveImageFromVariant(index, imgIndex)}
//                                                 className="text-errorRed text-xs mt-1">Remove</button>
//                                         </div>
//                                     ))}
//                                     <label className="w-28 h-28 flex items-center justify-center bg-green_100 mt-2 rounded-lg cursor-pointer">
//                                         <ImageCrop index={index} handleAddImageToVariant={handleAddImageToVariant} />
//                                         +
//                                     </label>

//                                 </div>
//                                 {validationErrors[`variantPrice${index}`] && <p className="text-red-500 text-xs">{validationErrors[`variantPrice${index}`]}</p>}
//                             </div>
//                         </div>
//                     ))}
//                     <button type="button" onClick={handleAddVariant} className="mt-2 text-blue-500">Add Variant</button>
//                 </div>

//                 {/* Additional Info */}
//                 <div>
//                     <label className="block text-sm mb-1 text-form_label_grey">Delivery Condition</label>
//                     <input name="deliveryCondition" value={formData.deliveryCondition} onChange={handleChange} type="text" className="w-full px-3 py-2 border rounded-md bg-form_inputFeild_background_grey" />
//                     {validationErrors.deliveryCondition && <p className="text-red-500 text-xs">{validationErrors.deliveryCondition}</p>}
//                 </div>

//                 <div>
//                     <label className="block text-sm mb-1 text-form_label_grey">Warranty</label>
//                     <input name="warranty" value={formData.warranty} onChange={handleChange} type="text" className="w-full px-3 py-2 border rounded-md bg-form_inputFeild_background_grey" />
//                     {validationErrors.warranty && <p className="text-red-500 text-xs">{validationErrors.warranty}</p>}
//                 </div>

//                 <div>
//                     <label className="block text-sm mb-1 text-form_label_grey">Related Keywords</label>
//                     <input name="relatedKeywords" value={formData.relatedKeywords} onChange={handleChange} type="text" className="w-full px-3 py-2 border rounded-md bg-form_inputFeild_background_grey" />
//                     {validationErrors.relatedKeywords && <p className="text-red-500 text-xs">{validationErrors.relatedKeywords}</p>}
//                 </div>

//                 {/* Submit and Error Handling */}
//                 {error && <p className="text-red-500">{error}</p>}
//                 <div className="flex justify-between mt-5">
//                     <button type="button" onClick={() => navigate(`/${MANAGEMENT_ROUTES.PRODUCTS}/${MANAGEMENT_ROUTES.PRODUCTS_LIST}`)} className="px-6 py-3 rounded-3xl bg-red-500 text-white hover:bg-red-600">Cancel</button>
//                     <button type="submit" className="px-6 py-3 rounded-3xl bg-green_500 text-white hover:bg-green_600">Save</button>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default EditProduct;






















// // import React, { useEffect, useState } from 'react';
// // import { useForm } from 'react-hook-form';
// // import ImageCrop from '../../../Test/ImageCrop';
// // import api from '../../../../api/apiConfig';
// // import { addProduct, fetchDetails } from '../../../../api/productManagement';
// // import { useNavigate, useParams } from 'react-router-dom';
// // import { GiCancel } from 'react-icons/gi';
// // import { useSelector } from 'react-redux';
// // import { listCategory } from '../../../../api/categoryManagement';

// // const EditProduct = () => {

// //     const [error, setError] = useState("")
// //     const [categoryList, setCategoryList] = useState([])
// //     const navigate = useNavigate();
// //     const { role } = useSelector(state => state.auth);
// //     const [selectedCategory, setSelectedCategory] = useState('');
// //     const [subCategories, setSubCategories] = useState([]);

// //     //Needed
// //     const { id } = useParams()
// //     const [product, setProducts] = useState({})
// //     const [variants, setVariants] = useState([{ color: '', colorHex: '#000000', stock: '', images: [] }]);
// //     const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
// //         defaultValues: {
// //             itemProperties: [],
// //             category: product.category || '',
// //         },
// //     });


// //     useEffect(() => {
// //         const fetchProductDetails = async () => {
// //             try {
// //                 const list = await fetchDetails(id)
// //                 // setSelectedVariant(list[0].variants[0]);
// //                 // setSelectedImage(list[0].variants[0].images[0])
// //                 // setProduct(list[0]);
// //                 // setLoading(false)
// //                 setProducts(list[0]);
// //                 setVariants(list[0].variants)
// //                 console.log(list[0]);
// //                 setValue('itemProperties', product.itemProperties || []);
// //                 setValue('category', list[0].category || '');
// //                 console.log(product.category);

// //             } catch (error) {
// //                 console.error('Error fetching products:', error);
// //             }
// //         };

// //         fetchProductDetails();
// //     }, [])

// //     useEffect(() => {
// //         if (product) {
// //             setValue('category', product.category || ''); // Update the category when the product changes
// //         }
// //     }, [product, setValue]);

// //     useEffect(() => {
// //         const fetchCategories = async () => {
// //             try {
// //                 const list = await listCategory(role)
// //                 console.log(list);
// //                 setCategoryList(list);

// //             } catch (error) {
// //                 console.error('Error fetching products:', error);
// //             }
// //         };

// //         fetchCategories();
// //     }, []);

// //     const onSubmit = async (data) => {
// //         // if (variants.length === 0) {
// //         //     setError("You must add at least one variant.");
// //         //     return;
// //         // }

// //         // for (let i = 0; i < variants.length; i++) {
// //         //     if (variants[i].images.length < 3) {
// //         //         setError(`Variant ${i + 1} must have at least 3 images.`);
// //         //         return;
// //         //     }
// //         // }
// //         console.log(data);



// //         try {
// //             // Create FormData object
// //             // const formData = new FormData();

// //             // // Append non-array fields
// //             // formData.append('category', data.category);
// //             // formData.append('subCategory', data.subCategory);
// //             // formData.append('title', data.title);
// //             // formData.append('description', data.description);
// //             // formData.append('deliveryCondition', data.deliveryCondition);
// //             // formData.append('warranty', data.warranty);
// //             // formData.append('relatedKeywords', data.relatedKeywords);

// //             // // Append item properties
// //             // data.itemProperties.forEach((property, index) => {
// //             //     formData.append(`itemProperties[${index}][field]`, property.field);
// //             //     formData.append(`itemProperties[${index}][value]`, property.value);
// //             // });

// //             // // Append variants
// //             // variants.forEach((variant, index) => {
// //             //     formData.append(`variants[${index}][color]`, variant.color);
// //             //     formData.append(`variants[${index}][colorHex]`, variant.colorHex);
// //             //     formData.append(`variants[${index}][stock]`, variant.stock);
// //             //     formData.append(`variants[${index}][price]`, variant.price);

// //             //     // Append images
// //             //     variant.images.forEach((img, imgIndex) => {
// //             //         console.log(`variants[${index}][images][${imgIndex}]`);

// //             //         formData.append(`variants[${index}][images][${imgIndex}]`, img.blob);
// //             //     });
// //             // });

// //             // // Send request to the API
// //             // const response = await api.post('/seller/products/add', formData, {
// //             //     headers: {
// //             //         'Content-Type': 'multipart/form-data',
// //             //     },
// //             // });

// //             // // Handle success response
// //             // console.log('Product added successfully:', response.data);
// //             // navigate("/seller/products/list")
// //         } catch (error) {
// //             setError("Failed to add product.");
// //             console.error('Error:', error);
// //         }
// //     };

// //     const handleAddVariant = () => {
// //         setVariants((prev) => [...prev, { color: '', colorHex: '#000000', stock: '', price: '', images: [] }]);
// //     };

// //     const handleRemoveVariant = (index) => {
// //         const newVariants = variants.filter((_, i) => i !== index);
// //         setVariants(newVariants);
// //     };

// //     const handleAddImageToVariant = (index, croppedImage) => {
// //         const updatedVariants = [...variants];

// //         // Convert base64 image string to a Blob
// //         const blob = dataURLtoBlob(croppedImage);
// //         console.log(blob);

// //         updatedVariants[index].images.push({ imageUrl: croppedImage, blob });
// //         setVariants(updatedVariants);
// //     };

// //     const dataURLtoBlob = (dataURL) => {
// //         const arr = dataURL.split(',');
// //         const mime = arr[0].match(/:(.*?);/)[1];
// //         const bstr = atob(arr[1]);
// //         let n = bstr.length;
// //         const u8arr = new Uint8Array(n);
// //         while (n--) {
// //             u8arr[n] = bstr.charCodeAt(n);
// //         }
// //         return new Blob([u8arr], { type: mime });
// //     };

// //     const handleRemoveImageFromVariant = (variantIndex, imageIndex) => {
// //         const updatedVariants = [...variants];
// //         updatedVariants[variantIndex].images.splice(imageIndex, 1);
// //         setVariants(updatedVariants);
// //     };

// //     const handleCategoryChange = (event) => {
// //         const categoryId = event.target.value;
// //         setSelectedCategory(categoryId);

// //         // Find the selected category and update subcategories
// //         const selectedCategoryData = categoryList.find(category => category._id === categoryId);
// //         console.log(selectedCategoryData);

// //         if (selectedCategoryData) {
// //             setSubCategories(selectedCategoryData.subcategories);
// //         } else {
// //             setSubCategories([]); // Reset if no category is selected
// //         }
// //     };

// //     return (
// //         <div className='max-w-4xl'>
// //             <h1 className="text-2xl font-semibold mb-2 mt-6 px-5 font-nunito">Add New Product</h1>
// //             <hr className='mb-5 mx-4' />
// //             <form onSubmit={handleSubmit(onSubmit)} className="w-auto bg-white m-3 p-16 rounded-lg shadow-lg font-nunito flex flex-col gap-5">

// //                 {/* Product Details */}
// //                 <h3 className="font-semibold text-green_600">Product Details</h3>
// //                 <div className="grid grid-cols-3 gap-5">
// //                     <div>
// //                         <label className="block text-sm mb-1 text-form_label_grey">Category</label>
// //                         <select {...register('category', { required: 'Category is required' })} className={`w-full px-3 py-2 border ${errors.category ? 'border-red-500' : 'border-form_inputFeild_stroke_grey'} rounded-md bg-form_inputFeild_background_grey`} onChange={handleCategoryChange}
// //                         >
// //                             <option value="">Select a category</option>
// //                             {
// //                                 categoryList.map((category) => (
// //                                     <option key={category._id} value={category._id}>
// //                                         {category.name}
// //                                     </option>
// //                                 ))
// //                             }
// //                         </select>
// //                         {errors.category && <p className="text-errorRed text-xs mt-1">{errors.category.message}</p>}
// //                     </div>

// //                     <div>
// //                         <label className="block text-sm mb-1 text-form_label_grey">Sub Category</label>
// //                         <select {...register('subCategory', { required: 'Sub Category is required' })} className={`w-full px-3 py-2 border ${errors.subCategory ? 'border-red-500' : 'border-form_inputFeild_stroke_grey'} rounded-md bg-form_inputFeild_background_grey`}>
// //                             <option value="">Select a subcategory</option>
// //                             {
// //                                 subCategories.map((subCategory) => (
// //                                     <option key={subCategory._id} value={subCategory.name}>
// //                                         {subCategory.name}
// //                                     </option>
// //                                 ))
// //                             }
// //                         </select>
// //                         {errors.subCategory && <p className="text-errorRed text-xs mt-1">{errors.subCategory.message}</p>}
// //                     </div>

// //                     <div className='col-span-2'>
// //                         <label className="block text-sm mb-1 text-form_label_grey">Title</label>
// //                         <input {...register('title', { required: 'Title is required' })} defaultValue={product.title} type="text" className={`w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-form_inputFeild_stroke_grey'} rounded-md bg-form_inputFeild_background_grey`} />
// //                         {errors.title && <p className="text-errorRed text-xs mt-1">{errors.title.message}</p>}
// //                     </div>
// //                 </div>

// //                 <div>
// //                     <label className="block text-sm mb-1 text-form_label_grey">Description</label>
// //                     <textarea {...register('description', { required: 'Description is required' })} defaultValue={product.description} className={`w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-form_inputFeild_stroke_grey'} rounded-md bg-form_inputFeild_background_grey`} rows="4"></textarea>
// //                     {errors.description && <p className="text-errorRed text-xs mt-1">{errors.description.message}</p>}
// //                 </div>

// //                 {/* Variants Section */}
// //                 <div>
// //                     <h3 className="font-semibold mt-4 text-green_600 mb-3">Product Variants</h3>
// //                     {variants.map((variant, index) => (
// //                         <div key={index} className="border-2 p-4 rounded-md mt-1">
// //                             <div className='flex mb-2'>
// //                                 {/* Color Hex Input */}
// //                                 <input
// //                                     type="color"
// //                                     value={variant.colorHex}
// //                                     onChange={(e) => {
// //                                         const newVariants = [...variants];
// //                                         newVariants[index].colorHex = e.target.value;
// //                                         setVariants(newVariants);
// //                                     }}
// //                                     className="w-full h-5 mr-3"
// //                                 />
// //                                 <button type="button" onClick={() => handleRemoveVariant(index)} className=" text-errorRed text-xs "><GiCancel size={20} /></button>
// //                             </div>

// //                             <div className="flex justify-between mb-2">
// //                                 {/* Color Input */}
// //                                 <div className=" flex items-center gap-3 mt-1">
// //                                     <input
// //                                         {...register(`variants.${index}.color`, { required: 'Color is required' })}
// //                                         placeholder="Color"
// //                                         value={variant.color}
// //                                         onChange={(e) => {
// //                                             const newVariants = [...variants];
// //                                             newVariants[index].color = e.target.value;
// //                                             setVariants(newVariants);
// //                                         }}
// //                                         className={`px-3 py-2 border ${errors.variants?.[index]?.color ? 'border-red-500' : 'border-form_inputFeild_stroke_grey'} rounded-md`}
// //                                     />
// //                                     {/* Display error message for Color */}
// //                                     {errors.variants?.[index]?.color && (
// //                                         <p className="text-errorRed text-xs mt-1">
// //                                             {errors.variants[index].color.message}
// //                                         </p>
// //                                     )}
// //                                 </div>


// //                                 {/* Stock Input */}
// //                                 <div className=" mt-1">
// //                                     <input
// //                                         {...register(`variants.${index}.stock`, {
// //                                             required: 'Stock is required',
// //                                             valueAsNumber: true,
// //                                             min: { value: 0, message: 'Stock must be a positive number' },
// //                                         })}
// //                                         placeholder="Stock"
// //                                         type="number"
// //                                         value={variant.stock}
// //                                         onChange={(e) => {
// //                                             const newVariants = [...variants];
// //                                             newVariants[index].stock = e.target.value;
// //                                             setVariants(newVariants);
// //                                         }}
// //                                         className={`px-3 py-2 border ${errors.variants?.[index]?.stock ? 'border-red-500' : 'border-form_inputFeild_stroke_grey'} rounded-md`}
// //                                     />
// //                                     {/* Display error message for Stock */}
// //                                     {errors.variants?.[index]?.stock && (
// //                                         <p className="text-errorRed text-xs mt-1">
// //                                             {errors.variants[index].stock.message}
// //                                         </p>
// //                                     )}
// //                                 </div>

// //                                 {/* Price */}
// //                                 <div className=" mt-1">
// //                                     <input
// //                                         {...register(`variants.${index}.price`, {
// //                                             required: 'Price is required',
// //                                             valueAsNumber: true,
// //                                             min: { value: 0, message: 'Price must be a positive number' },
// //                                         })}
// //                                         placeholder="Price"
// //                                         type="number"
// //                                         value={variant.price}
// //                                         onChange={(e) => {
// //                                             const newVariants = [...variants];
// //                                             newVariants[index].price = e.target.value;
// //                                             setVariants(newVariants);
// //                                         }}
// //                                         className={`px-3 py-2 border ${errors.variants?.[index]?.price ? 'border-red-500' : 'border-form_inputFeild_stroke_grey'} rounded-md`}
// //                                     />
// //                                     {/* Display error message for Stock */}
// //                                     {errors.variants?.[index]?.price && (
// //                                         <p className="text-errorRed text-xs mt-1">
// //                                             {errors.variants[index].price.message}
// //                                         </p>
// //                                     )}
// //                                 </div>
// //                             </div>


// //                             <div className="flex flex-wrap space-x-4">
// //                                 {variant.images.map((img, imgIndex) => (
// //                                     <div key={imgIndex} className="flex flex-col items-center">
// //                                         <img src={img.imageUrl || img.secure_url} alt="product" className="w-28 h-28 object-cover rounded-lg mt-2" />
// //                                         <button type="button" onClick={() => handleRemoveImageFromVariant(index, imgIndex)} className="text-errorRed text-xs mt-1">Remove</button>
// //                                     </div>
// //                                 ))}
// //                                 <label className="w-28 h-28 flex items-center justify-center bg-green_100 mt-2 rounded-lg cursor-pointer">
// //                                     <ImageCrop index={index} handleAddImageToVariant={handleAddImageToVariant} />
// //                                     +
// //                                 </label>

// //                             </div>

// //                         </div>
// //                     ))}
// //                     <button type="button" onClick={handleAddVariant} className="w-44 mt-3 bg-green_500 hover:bg-green_600 text-white px-6 py-3 rounded-3xl text-sm font-medium">Add Variants</button>
// //                 </div>

// //                 {/*Product Properties*/}
// //                 <div>
// //                     <label className="block text-sm mb-1 text-form_label_grey">Add Item Property</label>
// //                     {watch('itemProperties', [0]).map((property, index) => (
// //                         <div key={index} className="flex gap-6 mt-1">
// //                             <input
// //                                 {...register(`itemProperties.${index}.field`, { required: 'Field is required' })}
// //                                 placeholder="Field (e.g., Height)"
// //                                 className={`w-64 px-3 py-2 border ${errors.itemProperties?.[index]?.field ? 'border-red-500' : 'border-form_inputFeild_stroke_grey'} rounded-md bg-form_inputFeild_background_grey focus:border-2 focus:border-green_500 focus:outline-none`}
// //                             />
// //                             <input
// //                                 {...register(`itemProperties.${index}.value`, { required: 'Value is required' })}
// //                                 placeholder="Value (e.g., 100 CM)"
// //                                 className={`w-64 px-3 py-2 border ${errors.itemProperties?.[index]?.value ? 'border-red-500' : 'border-form_inputFeild_stroke_grey'} rounded-md bg-form_inputFeild_background_grey focus:border-2 focus:border-green_500 focus:outline-none`}
// //                             />
// //                             {errors.itemProperties?.[index]?.field && (
// //                                 <p className="text-errorRed text-xs mt-1">{errors.itemProperties[index].field.message}</p>
// //                             )}

// //                         </div>
// //                     ))}
// //                     <button type="button" onClick={() => {
// //                         const currentProperties = watch('itemProperties') || [];
// //                         setValue('itemProperties', [...currentProperties, { field: '', value: '' }]);
// //                     }} className="w-44 bg-green_500 hover:bg-green_600 text-white px-6 py-3 rounded-3xl text-sm font-medium mt-3">
// //                         Add Properties
// //                     </button>
// //                 </div>

// //                 {/*Delivery Condition*/}
// //                 <div>
// //                     <label className="block text-sm mb-1 text-form_label_grey">Delivery Condition</label>
// //                     <select {...register('deliveryCondition', { required: 'Delivery condition is required' })} className={`w-1/2 px-3 py-2 border ${errors.deliveryCondition ? 'border-red-500' : 'border-form_inputFeild_stroke_grey'} rounded-md bg-form_inputFeild_background_grey focus:border-2 focus:border-green_500 focus:outline-none`}>
// //                         <option value="">Select a delivery condition</option>
// //                         <option value="Assembled">Assembled</option>
// //                         <option value="Non-Assembled">Non-Assembled</option>
// //                         <option value="Installation by Service Partner">Installation by Service Partner</option>
// //                     </select>
// //                     {errors.deliveryCondition && <p className="text-errorRed text-xs mt-1">{errors.deliveryCondition.message}</p>}
// //                 </div>

// //                 {/*Warranty Information*/}
// //                 <div>
// //                     <label className="block text-sm mb-1 text-form_label_grey">Warranty Information</label>
// //                     <textarea {...register('warranty', { required: 'Warranty information is required' })} defaultValue={product.warranty} className={`w-full px-3 py-2 border ${errors.warranty ? 'border-red-500' : 'border-form_inputFeild_stroke_grey'} rounded-md bg-form_inputFeild_background_grey focus:border-2 focus:border-green_500 focus:outline-none`} rows="2"></textarea>
// //                     {errors.warranty && <p className="text-errorRed text-xs mt-1">{errors.warranty.message}</p>}
// //                 </div>

// //                 {/*Related Keywords*/}
// //                 <div>
// //                     <label className="block text-sm mb-1 text-form_label_grey">Related Keywords</label>
// //                     <textarea {...register('relatedKeywords', { required: 'Keywords are required' })} defaultValue={product.relatedKeywords} className={`w-full px-3 py-2 border ${errors.relatedKeywords ? 'border-red-500' : 'border-form_inputFeild_stroke_grey'} rounded-md bg-form_inputFeild_background_grey focus:border-2 focus:border-green_500 focus:outline-none`} rows="1"></textarea>
// //                     {errors.relatedKeywords && <p className="text-errorRed text-xs mt-1">{errors.relatedKeywords.message}</p>}
// //                 </div>

// //                 {/* Show Error */}
// //                 {error && <p className="text-errorRed text-xs">{error}</p>}

// //                 {/* Submit Button */}
// //                 <button type="submit" className="w-full bg-green_500 hover:bg-green_600 text-white px-6 py-3 rounded-md text-sm font-medium mt-5">
// //                     Add Now
// //                 </button>
// //             </form>
// //         </div>
// //     );
// // };

// // export default EditProduct;
